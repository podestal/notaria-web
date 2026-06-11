import { FileText } from "lucide-react"
import { RECIBO_COMPROBANTE_FACTURA } from "../../../services/taxes/recibosService"
import ComprobanteSectionMain from "../comprobantes/ComprobanteSectionMain"
import ComprobantesList from "../comprobantes/ComprobantesList"
import CreateRecibo from "../comprobantes/CreateRecibo"

const FacturasMain = () => (
    <ComprobanteSectionMain
        icon={FileText}
        title="Facturas"
        description="Registre facturas de venta y consulte comprobantes electrónicos emitidos."
        createTitle="Nueva factura"
        createDescription="Complete los datos para emitir una factura de venta."
        createForm={(onDone) => <CreateRecibo variant="factura" onDone={onDone} />}
        reporteTitle="Reporte de facturas"
        reporteDescription="Consulte y filtre las facturas emitidas."
        listVariant="recibo"
        renderReporteList={(context) => (
            <ComprobantesList
                variant="recibo"
                comprobante={RECIBO_COMPROBANTE_FACTURA}
                entityLabel="factura"
                entityLabelPlural="facturas"
                {...context}
            />
        )}
    />
)

export default FacturasMain
