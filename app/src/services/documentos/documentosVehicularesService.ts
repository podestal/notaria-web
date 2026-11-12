import documentosAxios from "./documentosClient"

export type DocumentoBienStatus = "pending" | "parsed" | "applied" | "error"

export interface DocumentoBien {
    id: number
    tipo: "vehicular" | "inmueble"
    status: DocumentoBienStatus
    original_filename: string
    stored_filename: string
    relative_path: string
    file_size: number
    placa: string
    partida: string
    oficina: string
    parsed: Record<string, unknown>
    parse_error: string
    detveh: number | null
    kardex: string
    idtipacto: string
    applied_at: string | null
    linked?: boolean
    created_at: string | null
    updated_at: string | null
}

export const submitDocumentoVehicular = async (
    file: File,
    access: string,
): Promise<DocumentoBien> => {
    const formData = new FormData()
    formData.append("file", file, file.name)
    const { data } = await documentosAxios.post<DocumentoBien>(
        "vehiculares/",
        formData,
        {
            headers: {
                Authorization: `JWT ${access}`,
                "Content-Type": "multipart/form-data",
            },
        },
    )
    return data
}

export const listDocumentosVehiculares = async (
    access: string,
): Promise<DocumentoBien[]> => {
    const { data } = await documentosAxios.get<DocumentoBien[]>(
        "vehiculares/",
        { headers: { Authorization: `JWT ${access}` } },
    )
    return data
}

export const listPendingDocumentosVehiculares = async (
    access: string,
): Promise<DocumentoBien[]> => {
    const { data } = await documentosAxios.get<DocumentoBien[]>(
        "vehiculares/pendientes/",
        { headers: { Authorization: `JWT ${access}` } },
    )
    return data
}

export const deleteDocumentoBien = async (
    id: number,
    access: string,
): Promise<void> => {
    await documentosAxios.delete(`${id}/`, {
        headers: { Authorization: `JWT ${access}` },
    })
}

export interface ApplyDocumentoVehicularPayload {
    documento_id: number
    kardex: string
    idtipacto: string
    replace_existing?: boolean
    overwrite_detalle?: boolean
    detveh?: number
}

export interface ApplyDocumentoVehicularResponse {
    documento: DocumentoBien
    detallevehicular: Record<string, unknown>
}

export const applyDocumentoVehicular = async (
    payload: ApplyDocumentoVehicularPayload,
    access: string,
): Promise<ApplyDocumentoVehicularResponse> => {
    const { data } = await documentosAxios.post<ApplyDocumentoVehicularResponse>(
        "vehiculares/aplicar/",
        payload,
        { headers: { Authorization: `JWT ${access}` } },
    )
    return data
}

export const isDocumentoLinked = (doc: DocumentoBien): boolean =>
    Boolean(doc.linked ?? doc.detveh != null)
