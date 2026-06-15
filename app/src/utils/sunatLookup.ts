import axios from "axios"

export interface SunatPersonaFields {
    razon_social: string
    direccion: string
}

export const lookupSunatByRuc = async (ruc: string): Promise<SunatPersonaFields> => {
    const document = ruc.replace(/\D/g, "").slice(0, 11)
    if (document.length !== 11) {
        throw new Error("Ingrese un RUC válido de 11 dígitos.")
    }

    const response = await axios.post(import.meta.env.VITE_MIGO_RUC_URL, {
        ruc: document,
        token: import.meta.env.VITE_MIGO_TOKEN,
    })

    const razonSocial = String(response.data?.nombre_o_razon_social || "").trim()
    if (!razonSocial) {
        throw new Error("No se encontró información en SUNAT para este RUC.")
    }

    return {
        razon_social: razonSocial,
        direccion: String(response.data?.direccion_simple || "").trim(),
    }
}
