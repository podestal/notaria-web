import type { ComplianceKardexErrorsResponse } from "../../../../services/compliance/complianceService"

export type ProgressStatus = "done" | "warning" | "error" | "idle"

export interface ProgressIssue {
    level: "error" | "warning"
    text: string
    source?: string
}

export interface ContratantesStage {
    status: ProgressStatus
    issues: ProgressIssue[]
}

export interface PatrimonialStageStep {
    id: string
    status: ProgressStatus
    issues: ProgressIssue[]
}

export interface ProgressStep {
    id: string
    label: string
    status: ProgressStatus
    issues: ProgressIssue[]
    children?: ProgressStep[]
}

/** Tipos 2 y 5 no llevan pestañas patrimonial ni participa. */
const WITHOUT_PATRIMONIAL = new Set([2, 5])

export const kardexHasPatrimonial = (idtipkar?: number | null) =>
    idtipkar != null && !WITHOUT_PATRIMONIAL.has(idtipkar)

interface StepDef {
    id: string
    label: string
    children?: StepDef[]
}

export function kardexProgressSteps(idtipkar?: number | null): StepDef[] {
    const patrimonial = kardexHasPatrimonial(idtipkar)
    const steps: StepDef[] = [{ id: "contratantes", label: "Contratantes" }]

    if (patrimonial) {
        steps.push({
            id: "patrimonial",
            label: "Patrimonial",
            children: [
                { id: "medio-pago", label: "Medio de pago" },
                { id: "detalle-bien", label: "Detalle del bien" },
            ],
        })
        steps.push({
            id: "participa",
            label: "Participa",
            children: [{ id: "preguntas-uif", label: "Preguntas UIF" }],
        })
    }

    steps.push(
        { id: "digitacion", label: "Digitación" },
        { id: "escrituracion", label: "Escrituración" },
    )

    return steps
}

const STEP_RULES: { id: string; test: RegExp }[] = [
    { id: "escrituracion", test: /concluir el instrumento|firma de los contratantes/i },
    { id: "medio-pago", test: /medio de pago|forma de pago|oportunidad de pago|entidad financiera|\bbanco\b/i },
    { id: "detalle-bien", test: /detalle del bien|\bbien\b|predio|veh[ií]culo|placa/i },
    { id: "preguntas-uif", test: /renta|formulario|pregunta|impuesto/i },
    { id: "participa", test: /participa|origen de fondo|monto inv[aá]lido/i },
    { id: "patrimonial", test: /patrimonial|cuant[ií]a|moneda/i },
    { id: "contratantes", test: /contratante|documento|dni|ruc|profesi|direcci|ubigeo|apellido|nacionalidad/i },
    { id: "escrituracion", test: /escritur|folio|instrumento|minuta|n[uú]mero de escritura/i },
    { id: "digitacion", test: /digitaci|plantilla/i },
]

const OWNED_BY_API = new Set([
    "contratantes",
    "patrimonial",
    "medio-pago",
    "detalle-bien",
    "participa",
    "preguntas-uif",
    "digitacion",
    "escrituracion",
])

function findStep(steps: ProgressStep[], id: string): ProgressStep | undefined {
    for (const step of steps) {
        if (step.id === id) return step
        const child = step.children ? findStep(step.children, id) : undefined
        if (child) return child
    }
    return undefined
}

function applyOwnedSteps(
    steps: ProgressStep[],
    ids: string[],
    fromApi: PatrimonialStageStep[] | null | undefined,
) {
    for (const id of ids) {
        const node = findStep(steps, id)
        if (!node) continue
        const match = fromApi?.find((step) => step.id === id)
        if (!match || match.status === "idle") {
            node.status = "idle"
            node.issues = []
        } else {
            node.status = match.status
            node.issues = match.issues
        }
    }
}

function assignStep(text: string, allowed: Set<string>): string | null {
    for (const rule of STEP_RULES) {
        if (allowed.has(rule.id) && rule.test.test(text)) return rule.id
    }
    return null
}

function flattenIds(steps: StepDef[]): Set<string> {
    const ids = new Set<string>()
    for (const step of steps) {
        ids.add(step.id)
        step.children?.forEach((child) => ids.add(child.id))
    }
    return ids
}

function pdtText(item: string | { error?: string; error_description?: string }): string {
    if (typeof item === "string") return item
    return item.error_description || item.error || ""
}

function collectIssues(data: ComplianceKardexErrorsResponse): ProgressIssue[] {
    const issues: ProgressIssue[] = []
    const sisgen = data.errors?.sisgen
    const uif = data.errors?.uif
    const pdt = data.errors?.pdt

    for (const text of sisgen?.errores ?? []) {
        if (text.trim()) issues.push({ level: "error", text: text.trim() })
    }
    for (const text of sisgen?.personas ?? []) {
        if (text.trim()) issues.push({ level: "warning", text: text.trim() })
    }
    for (const text of sisgen?.observaciones ?? []) {
        if (text.trim()) issues.push({ level: "warning", text: text.trim() })
    }
    for (const item of uif?.errors ?? []) {
        const text = item.error_description?.trim()
        if (text) issues.push({ level: "error", text })
    }
    for (const item of uif?.observations ?? []) {
        const text = item.error_description?.trim()
        if (text) issues.push({ level: "warning", text })
    }
    for (const item of pdt?.errors ?? []) {
        const text = pdtText(item).trim()
        if (text) issues.push({ level: "error", text })
    }
    return issues
}

function worst(statuses: ProgressStatus[]): ProgressStatus {
    if (statuses.includes("error")) return "error"
    if (statuses.includes("warning")) return "warning"
    if (statuses.includes("idle")) return "idle"
    return "done"
}

function decorate(
    def: StepDef,
    byStep: Map<string, ProgressIssue[]>,
    evaluated: boolean,
): ProgressStep {
    const children = def.children?.map((child) => decorate(child, byStep, evaluated))
    const own = byStep.get(def.id) ?? []
    const nested = children?.flatMap((child) => child.issues) ?? []
    const issues = [...own, ...nested]
    let status: ProgressStatus = evaluated ? "done" : "idle"
    if (children?.length) {
        status = worst(children.map((child) => child.status))
        if (own.some((issue) => issue.level === "error")) status = "error"
        else if (status !== "error" && own.some((issue) => issue.level === "warning")) status = "warning"
    } else if (own.some((issue) => issue.level === "error")) {
        status = "error"
    } else if (own.some((issue) => issue.level === "warning")) {
        status = "warning"
    }
    return { id: def.id, label: def.label, status, issues: own, children }
}

export function buildKardexProgress(
    idtipkar: number | null | undefined,
    data: ComplianceKardexErrorsResponse | undefined,
    contratantes?: ContratantesStage | null,
    patrimonial?: PatrimonialStageStep[] | null,
    participa?: PatrimonialStageStep[] | null,
    instrumento?: PatrimonialStageStep[] | null,
): { steps: ProgressStep[]; unmatched: ProgressIssue[] } {
    const defs = kardexProgressSteps(idtipkar)
    const allowed = flattenIds(defs)
    const byStep = new Map<string, ProgressIssue[]>()
    const unmatched: ProgressIssue[] = []

    if (data) {
        for (const issue of collectIssues(data)) {
            if (/facturaci|comprobante|boleta/i.test(issue.text)) continue
            const stepId = assignStep(issue.text, allowed)
            if (!stepId || OWNED_BY_API.has(stepId)) {
                if (!stepId) unmatched.push(issue)
                continue
            }
            const list = byStep.get(stepId) ?? []
            list.push(issue)
            byStep.set(stepId, list)
        }
    }

    const steps = defs.map((def) => decorate(def, byStep, Boolean(data)))
    const contratantesStage = steps.find((step) => step.id === "contratantes")
    if (contratantesStage) {
        if (!contratantes || contratantes.status === "idle") {
            contratantesStage.status = "idle"
            contratantesStage.issues = []
        } else {
            contratantesStage.status = contratantes.status
            contratantesStage.issues = contratantes.issues
        }
    }

    applyOwnedSteps(steps, ["patrimonial", "medio-pago", "detalle-bien"], patrimonial)
    applyOwnedSteps(steps, ["participa", "preguntas-uif"], participa)
    applyOwnedSteps(steps, ["digitacion", "escrituracion"], instrumento)

    return { steps, unmatched }
}

/** A finished stage is worth more than one error. Warnings do not reduce the score. */
const STAGE_POINTS = 4
const ERROR_POINTS = 1

function leaves(steps: ProgressStep[]): ProgressStep[] {
    const found: ProgressStep[] = []
    const walk = (list: ProgressStep[]) => {
        for (const step of list) {
            if (step.children?.length) walk(step.children)
            else found.push(step)
        }
    }
    walk(steps)
    return found
}

function countLevel(steps: ProgressStep[], level: "error" | "warning"): number {
    return steps.reduce((total, step) => {
        const here = step.issues.filter((issue) => issue.level === level).length
        return total + here + countLevel(step.children ?? [], level)
    }, 0)
}

export function kardexCompletion(steps: ProgressStep[], unmatched: ProgressIssue[] = []) {
    const stageList = leaves(steps)
    const stagesDone = stageList.filter(
        (step) => step.status === "done" || step.status === "warning",
    ).length
    const errorCount =
        countLevel(steps, "error") + unmatched.filter((issue) => issue.level === "error").length
    const warningCount =
        countLevel(steps, "warning") + unmatched.filter((issue) => issue.level === "warning").length
    const max = stageList.length * STAGE_POINTS + errorCount * ERROR_POINTS
    const earned = stagesDone * STAGE_POINTS
    const raw = max === 0 ? 0 : Math.round((earned / max) * 100)
    const percent = errorCount > 0 ? Math.min(raw, 99) : raw
    return {
        percent,
        stagesDone,
        stageTotal: stageList.length,
        errorCount,
        warningCount,
        complete: percent === 100 && errorCount === 0,
    }
}
