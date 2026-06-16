import type { Dispatch, SetStateAction } from "react"
import type { Ingreso } from "../../../services/taxes/ingresosService"
import ComprobantesList from "../comprobantes/ComprobantesList"
import type { ComprobanteItem } from "../comprobantes/comprobanteTypes"
import type { KardexPresenceFilter } from "./IngresosFilters"

interface Props {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    fecha_emision_desde: string
    fecha_emision_hasta: string
    persona_documento: string
    persona_nombres: string
    kardex: string
    has_kardex: KardexPresenceFilter
    usuario: string
    hasFilters: boolean
    onEdit?: (ingreso: Ingreso) => void
    onImprimir?: (ingreso: Ingreso) => void
    onAnular?: (ingreso: Ingreso) => void
    onCanjear?: (ingreso: Ingreso) => void
}

const asIngresoHandler =
    <T extends ComprobanteItem>(handler?: (ingreso: Ingreso) => void) =>
    (item: ComprobanteItem) => {
        if ("id_ingreso" in item) handler?.(item)
    }

const IngresosList = ({
    page,
    setPage,
    fecha_emision_desde,
    fecha_emision_hasta,
    persona_documento,
    persona_nombres,
    kardex,
    has_kardex,
    usuario,
    hasFilters,
    onEdit,
    onImprimir,
    onAnular,
    onCanjear,
}: Props) => (
    <ComprobantesList
        variant="ingreso"
        entityLabel="ingreso"
        entityLabelPlural="ingresos"
        page={page}
        setPage={setPage}
        fecha_emision_desde={fecha_emision_desde}
        fecha_emision_hasta={fecha_emision_hasta}
        persona_documento={persona_documento}
        persona_nombres={persona_nombres}
        kardex={kardex}
        has_kardex={has_kardex}
        usuario={usuario}
        hasFilters={hasFilters}
        onEdit={asIngresoHandler(onEdit)}
        onImprimir={asIngresoHandler(onImprimir)}
        onAnular={asIngresoHandler(onAnular)}
        onCanjear={asIngresoHandler(onCanjear)}
    />
)

export default IngresosList
