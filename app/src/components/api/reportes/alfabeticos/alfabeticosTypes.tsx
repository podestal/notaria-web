import type { ComponentType } from "react"
import AlfabeticoReport from "./AlfabeticoReport"

export type AlfabeticoTypeId =
    | "escrituras"
    | "no-contenciosos"
    | "transferencias-vehiculares"
    | "garantias-mobiliarias"
    | "testamentos"

export type AlfabeticoReportProps = {
    embedded?: boolean
}

type AlfabeticoOption = {
    id: AlfabeticoTypeId
    label: string
    idle: string
    active: string
    Component: ComponentType<AlfabeticoReportProps>
}

const makeReport = (
    idtipkar: number,
    url: string,
    name: string,
    title: string,
): ComponentType<AlfabeticoReportProps> => {
    const Report = ({ embedded = false }: AlfabeticoReportProps) => (
        <AlfabeticoReport
            embedded={embedded}
            idtipkar={idtipkar}
            url={url}
            name={name}
            title={title}
        />
    )
    Report.displayName = `AlfabeticoReport_${idtipkar}`
    return Report
}

export const ALFABETICOS_OPTIONS: AlfabeticoOption[] = [
    {
        id: "escrituras",
        label: "Escrituras Públicas",
        idle: "border-sky-600 bg-white text-sky-700 hover:bg-sky-50",
        active: "border-sky-600 bg-sky-600 text-white shadow-sm shadow-sky-200",
        Component: makeReport(
            1,
            "kardex/escrituras-alfabetico",
            "indice_alfabetico_escrituras",
            "Índice Alfabético de Escrituras Públicas",
        ),
    },
    {
        id: "no-contenciosos",
        label: "No Contenciosos",
        idle: "border-violet-600 bg-white text-violet-700 hover:bg-violet-50",
        active: "border-violet-600 bg-violet-600 text-white shadow-sm shadow-violet-200",
        Component: makeReport(
            2,
            "kardex/no-contenciosos-alfabetico",
            "indice_alfabetico_no_contenciosos",
            "Índice Alfabético de Asuntos No Contenciosos",
        ),
    },
    {
        id: "transferencias-vehiculares",
        label: "Vehiculares",
        idle: "border-amber-500 bg-white text-amber-700 hover:bg-amber-50",
        active: "border-amber-500 bg-amber-500 text-white shadow-sm shadow-amber-200",
        Component: makeReport(
            3,
            "kardex/transferencias-alfabetico",
            "indice_alfabetico_transferencias",
            "Índice Alfabético de Transferencias Vehiculares",
        ),
    },
    {
        id: "garantias-mobiliarias",
        label: "Garantías",
        idle: "border-emerald-600 bg-white text-emerald-700 hover:bg-emerald-50",
        active: "border-emerald-600 bg-emerald-600 text-white shadow-sm shadow-emerald-200",
        Component: makeReport(
            4,
            "kardex/garantias-alfabetico",
            "indice_alfabetico_garantias",
            "Índice Alfabético de Garantías Mobiliarias",
        ),
    },
    {
        id: "testamentos",
        label: "Testamentos",
        idle: "border-indigo-600 bg-white text-indigo-700 hover:bg-indigo-50",
        active: "border-indigo-600 bg-indigo-600 text-white shadow-sm shadow-indigo-200",
        Component: makeReport(
            5,
            "kardex/testamentos-alfabetico",
            "indice_alfabetico_testamentos",
            "Índice Alfabético de Testamentos",
        ),
    },
]
