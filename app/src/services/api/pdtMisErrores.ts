import APIClient from "./apiClient"

export interface PdtMisErrorUrgency {
    dias: number | null
    level: "urgent" | "warning" | "ok"
    label: string
    tone: "red" | "yellow" | "green" | "tomato"
}

export interface PdtMisError {
    idkardex: number
    kardex: string
    fechaescritura: string
    contrato: string
    error: string
    responsable: string
    contratante: string
    kind: "renta" | "bien" | "ofondo" | "conclusion"
    urgencia: PdtMisErrorUrgency
}

export interface PdtMisErroresPage {
    usuario: string
    year: number
    total: number
    counts: {
        renta: number
        bien: number
        ofondo: number
        conclusion: number
    }
    renta: PdtMisError[]
    bien: PdtMisError[]
    ofondo: PdtMisError[]
    conclusion: PdtMisError[]
    list: PdtMisError[]
}

export interface PdtRankingRow {
    user: string
    nombre: string
    total: number
}

export interface PdtRankingPage {
    year: number
    ranking: PdtRankingRow[]
    total: number
}

export const pdtMisErroresClient = new APIClient<PdtMisErroresPage>("/kardex/pdt-mis-errores/")
export const pdtRankingErroresClient = new APIClient<PdtRankingPage>("/kardex/pdt-ranking-errores/")
