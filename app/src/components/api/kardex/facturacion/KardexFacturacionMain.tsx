import { ArrowLeft, ClipboardList, FileText, Plus, Receipt, X } from "lucide-react"
import { useState } from "react"
import type { Kardex } from "../../../../services/api/kardexService"
import CreateRecibo from "../../../taxes/comprobantes/CreateRecibo"
import CreateIngreso from "../../../taxes/controlInterno/CreateIngreso"
import KardexFacturacionComprobantes from "./KardexFacturacionComprobantes"

type FacturacionType = "control_interno" | "boleta" | "factura"
type CreateFlowStep = "idle" | "pick-type" | "form"

interface Props {
    kardex: Kardex
}

const FACTURACION_OPTIONS: {
    id: FacturacionType
    label: string
    description: string
    icon: typeof ClipboardList
    accentClass: string
    iconClass: string
    ringClass: string
}[] = [
    {
        id: "control_interno",
        label: "Control interno",
        description: "Comprobante interno sin validez tributaria.",
        icon: ClipboardList,
        accentClass: "border-indigo-200 bg-indigo-50/60 hover:border-indigo-300 hover:bg-indigo-50",
        iconClass: "bg-indigo-100 text-indigo-700",
        ringClass: "ring-indigo-500",
    },
    {
        id: "boleta",
        label: "Boleta",
        description: "Boleta de venta electrónica.",
        icon: Receipt,
        accentClass: "border-emerald-200 bg-emerald-50/60 hover:border-emerald-300 hover:bg-emerald-50",
        iconClass: "bg-emerald-100 text-emerald-700",
        ringClass: "ring-emerald-500",
    },
    {
        id: "factura",
        label: "Factura",
        description: "Factura electrónica para persona jurídica.",
        icon: FileText,
        accentClass: "border-sky-200 bg-sky-50/60 hover:border-sky-300 hover:bg-sky-50",
        iconClass: "bg-sky-100 text-sky-700",
        ringClass: "ring-sky-500",
    },
]

const KardexFacturacionMain = ({ kardex }: Props) => {
    const [createStep, setCreateStep] = useState<CreateFlowStep>("idle")
    const [selectedType, setSelectedType] = useState<FacturacionType | null>(null)
    const [formKey, setFormKey] = useState(0)
    const [listKey, setListKey] = useState(0)

    const selectedOption = FACTURACION_OPTIONS.find(
        (option) => option.id === selectedType,
    )

    const handleCreateDone = () => {
        setFormKey((prev) => prev + 1)
        setListKey((prev) => prev + 1)
        setCreateStep("idle")
        setSelectedType(null)
    }

    const handleCancelCreate = () => {
        setCreateStep("idle")
        setSelectedType(null)
    }

    const handlePickType = (type: FacturacionType) => {
        setSelectedType(type)
        setFormKey((prev) => prev + 1)
        setCreateStep("form")
    }

    const renderForm = () => {
        if (!selectedType) return null

        switch (selectedType) {
            case "boleta":
                return (
                    <CreateRecibo
                        key={formKey}
                        variant="boleta"
                        onDone={handleCreateDone}
                        kardex={kardex.kardex}
                    />
                )
            case "factura":
                return (
                    <CreateRecibo
                        key={formKey}
                        variant="factura"
                        onDone={handleCreateDone}
                        kardex={kardex.kardex}
                    />
                )
            case "control_interno":
            default:
                return (
                    <CreateIngreso
                        key={formKey}
                        onDone={handleCreateDone}
                        kardex={kardex.kardex}
                    />
                )
        }
    }

    const SelectedFormIcon = selectedOption?.icon

    return (
        <div className="py-4">
            <header className="mb-5">
                <h2 className="text-base font-semibold text-slate-800">Facturación</h2>
                <p className="mt-1 text-xs text-slate-500">
                    Kardex {kardex.kardex}. Revise los comprobantes ya emitidos antes de
                    registrar uno nuevo.
                </p>
            </header>

            <div className="mb-6 rounded-xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4 shadow-sm">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-slate-800">
                        Comprobantes emitidos
                    </h3>
                </div>
                <KardexFacturacionComprobantes
                    key={listKey}
                    kardexCode={kardex.kardex}
                />
            </div>

            {createStep === "idle" && (
                <div className="flex justify-center border-t border-slate-100 pt-6">
                    <button
                        type="button"
                        onClick={() => setCreateStep("pick-type")}
                        className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-blue-700"
                    >
                        <Plus className="h-4 w-4" aria-hidden />
                        Crear documento
                    </button>
                </div>
            )}

            {createStep === "pick-type" && (
                <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                            <h3 className="text-sm font-semibold text-slate-800">
                                Nuevo documento
                            </h3>
                            <p className="mt-1 text-xs text-slate-500">
                                Elija el tipo de comprobante que desea emitir para este
                                kardex.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={handleCancelCreate}
                            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50"
                        >
                            <X className="h-3.5 w-3.5" aria-hidden />
                            Cancelar
                        </button>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        {FACTURACION_OPTIONS.map((option) => {
                            const Icon = option.icon

                            return (
                                <button
                                    key={option.id}
                                    type="button"
                                    onClick={() => handlePickType(option.id)}
                                    className={`flex flex-col items-start rounded-xl border p-4 text-left transition ${option.accentClass}`}
                                >
                                    <span
                                        className={`mb-3 flex h-10 w-10 items-center justify-center rounded-lg ${option.iconClass}`}
                                    >
                                        <Icon className="h-5 w-5" aria-hidden />
                                    </span>
                                    <span className="text-sm font-semibold text-slate-900">
                                        {option.label}
                                    </span>
                                    <span className="mt-1 text-xs text-slate-600">
                                        {option.description}
                                    </span>
                                </button>
                            )
                        })}
                    </div>
                </section>
            )}

            {createStep === "form" && selectedOption && SelectedFormIcon && (
                <section
                    className={`rounded-xl border bg-white p-4 shadow-sm ring-2 ring-offset-2 ${selectedOption.ringClass}`}
                >
                    <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
                            <p className="text-xs leading-relaxed text-amber-950">
                                <span className="font-bold">¿No era este documento?</span>{" "}
                                Vuelva atrás y elija control interno, boleta o factura.
                            </p>
                            <button
                                type="button"
                                onClick={() => setCreateStep("pick-type")}
                                className="inline-flex shrink-0 items-center gap-2 rounded-lg border-2 border-amber-500 bg-white px-4 py-2 text-sm font-bold text-amber-900 shadow-sm transition hover:border-amber-600 hover:bg-amber-100"
                            >
                                <ArrowLeft className="h-4 w-4" aria-hidden />
                                Cambiar tipo de documento
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <span
                                className={`flex h-9 w-9 items-center justify-center rounded-lg ${selectedOption.iconClass}`}
                            >
                                <SelectedFormIcon className="h-4 w-4" aria-hidden />
                            </span>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-800">
                                    {selectedOption.label}
                                </h3>
                                <p className="text-xs text-slate-500">
                                    {selectedOption.description}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div key={`${selectedType}-${formKey}`}>{renderForm()}</div>
                </section>
            )}
        </div>
    )
}

export default KardexFacturacionMain
