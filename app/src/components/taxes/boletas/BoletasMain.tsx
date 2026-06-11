import { Receipt } from "lucide-react"
import { RECIBO_COMPROBANTE_BOLETA } from "../../../services/taxes/recibosService"
import ComprobanteSectionMain from "../comprobantes/ComprobanteSectionMain"
import ComprobantesList from "../comprobantes/ComprobantesList"
import CreateRecibo from "../comprobantes/CreateRecibo"

const BoletasMain = () => (
    <ComprobanteSectionMain
        icon={Receipt}
        title="Boletas"
        description="Registre boletas de venta y consulte comprobantes electrónicos emitidos."
        createTitle="Nueva boleta"
        createDescription="Complete los datos para emitir una boleta de venta."
        createForm={(onDone) => <CreateRecibo variant="boleta" onDone={onDone} />}
        reporteTitle="Reporte de boletas"
        reporteDescription="Consulte y filtre las boletas emitidas."
        listVariant="recibo"
        renderReporteList={(context) => (
            <ComprobantesList
                variant="recibo"
                comprobante={RECIBO_COMPROBANTE_BOLETA}
                entityLabel="boleta"
                entityLabelPlural="boletas"
                {...context}
            />
        )}
    />
)

export default BoletasMain
