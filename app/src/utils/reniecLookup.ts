import axios from "axios"
import { toDateInputValue } from "./formatLocalDate"

export interface ReniecPersonaFields {
    nombres: string
    apellido_paterno: string
    apellido_materno: string
    fecha_nacimiento: string
    direccion: string
}

export const lookupReniecByDni = async (dni: string): Promise<ReniecPersonaFields> => {
    const document = dni.replace(/\D/g, "").slice(0, 8)
    if (document.length !== 8) {
        throw new Error("Ingrese un DNI válido de 8 dígitos.")
    }

    const response = await axios.get(
        `${import.meta.env.VITE_PERUDEVS_DNI_URL}document=${document}&key=${import.meta.env.VITE_PERUDEVS_TOKEN}`,
    )

    const resultado = response.data?.resultado
    if (!resultado) {
        throw new Error("No se encontró información en RENIEC para este DNI.")
    }

    return {
        nombres: String(resultado.nombres || "").trim(),
        apellido_paterno: String(resultado.apellido_paterno || "").trim(),
        apellido_materno: String(resultado.apellido_materno || "").trim(),
        fecha_nacimiento: toDateInputValue(resultado.fecha_nacimiento),
        direccion: String(resultado.direccion || "").trim(),
    }
}
