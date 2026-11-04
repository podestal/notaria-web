import APIClient from "./apiClient"
import type { PdtError } from "./pdtKardexErrors"

/** Payload row for pdt/correct_error.php */
export interface PdtCorrectionItem {
    id: number
    kardex: string
    tipoActo: string
    itemMp: string | number
    typeOfCorrection: number
    categoryCorrect: number
    writingDate: string
    idContractor: string | number
}

export interface PdtCorrectErrorsResponse {
    error: number
    errorDescription: string
}

export const toPdtCorrectionItem = (error: PdtError, id: number): PdtCorrectionItem => ({
    id,
    kardex: error.kardex,
    tipoActo: String(error.typeAct ?? ""),
    itemMp: error.itemMp ?? 0,
    typeOfCorrection: Number(error.typeOfCorrection || 0),
    categoryCorrect: Number(error.categoryCorrect || 0),
    writingDate: error.writingDate || "",
    idContractor: error.idContractor ?? 0,
})

const client = new APIClient<PdtCorrectErrorsResponse, { corrections: PdtCorrectionItem[] }>(
    "kardex/pdt-correct-errors/"
)

export const postPdtCorrectErrors = (
    access: string,
    corrections: PdtCorrectionItem[]
): Promise<PdtCorrectErrorsResponse> => client.post({ corrections }, access)

export default postPdtCorrectErrors
