import { useMemo } from "react"
import { Kardex } from "../../../services/api/kardexService"
import useGetContratantesByKardex from "../../../hooks/api/contratantes/useGetContratantesByKardex"

interface Props {
    kardex: Kardex
}

const FechaConclusionGate = ({ kardex }: Props) => {
    const { data: contratantes = [], isLoading, isError } = useGetContratantesByKardex({
        kardex: kardex.kardex,
    })

    const canShowFechaConclusion = useMemo(() => {
        if (!contratantes.length) return false
        const conFirma = contratantes.filter((c) => String(c.firma) === "1")
        if (conFirma.length === 0) return false
        return conFirma.every((c) => !!c.fechafirma?.trim())
    }, [contratantes])

    const fechaConclusion = kardex.fechaconclusion || kardex.fecha_conclusion || ""
    const canShow = canShowFechaConclusion && !!fechaConclusion.trim()

    if (isLoading || isError || !canShow) return null

    return (
        <div className="my-4 rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3">
            <p className="text-xs font-semibold text-emerald-800">Fecha de conclusion</p>
            <p className="mt-1 text-sm text-emerald-900">{fechaConclusion}</p>
        </div>
    )
}

export default FechaConclusionGate
