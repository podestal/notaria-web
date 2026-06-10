import type { Ingreso } from "../../../services/taxes/ingresosService"
import ComprobanteCard from "../comprobantes/ComprobanteCard"
import type { ComprobanteItem } from "../comprobantes/comprobanteTypes"

interface Props {
    ingreso: Ingreso
    onEdit?: (ingreso: Ingreso) => void
    onImprimir?: (ingreso: Ingreso) => void
    onAnular?: (ingreso: Ingreso) => void
    onCanjear?: (ingreso: Ingreso) => void
}

const asIngresoHandler =
    (handler?: (ingreso: Ingreso) => void) => (item: ComprobanteItem) => {
        if ("id_ingreso" in item) handler?.(item)
    }

const IngresoCard = ({
    ingreso,
    onEdit,
    onImprimir,
    onAnular,
    onCanjear,
}: Props) => (
    <ComprobanteCard
        variant="ingreso"
        item={ingreso}
        onEdit={asIngresoHandler(onEdit)}
        onImprimir={asIngresoHandler(onImprimir)}
        onAnular={asIngresoHandler(onAnular)}
        onCanjear={asIngresoHandler(onCanjear)}
    />
)

export default IngresoCard
