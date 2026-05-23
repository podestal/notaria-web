import type { Dispatch, SetStateAction } from "react"
import type { Cliente } from "../../../../../services/api/cliente1Service"
import { mapToGeneroMF } from "./generoUtils"

export interface SolicitanteFieldSetters {
    setSolicitante: Dispatch<SetStateAction<string>>
    setDomicilio: Dispatch<SetStateAction<string>>
    setDistrito: Dispatch<SetStateAction<string>>
    setProfesion: Dispatch<SetStateAction<string>>
    setEstadoCivil: Dispatch<SetStateAction<number>>
    setGenero: Dispatch<SetStateAction<string>>
}

export const applyClienteToSolicitante = (
    data: Cliente,
    {
        setSolicitante,
        setDomicilio,
        setDistrito,
        setProfesion,
        setEstadoCivil,
        setGenero,
    }: SolicitanteFieldSetters
) => {
    setSolicitante(
        `${data.prinom} ${data.segnom} ${data.apepat} ${data.apemat}`.replace(/\s+/g, " ").trim()
    )
    setDomicilio(data.direccion ?? "")
    setDistrito(data.idubigeo ?? "")
    setProfesion(
        data.detaprofesion ||
            data.profocupa ||
            (data.idprofesion != null ? String(data.idprofesion) : "")
    )
    setEstadoCivil(data.idestcivil ?? 0)
    setGenero(mapToGeneroMF(data.sexo))
}
