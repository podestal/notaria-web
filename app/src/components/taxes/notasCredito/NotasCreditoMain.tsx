import { ScrollText } from "lucide-react"
import { RECIBO_COMPROBANTE_NOTA_CREDITO } from "../../../services/taxes/recibosService"
import ComprobanteSectionMain from "../comprobantes/ComprobanteSectionMain"
import ComprobantesList from "../comprobantes/ComprobantesList"
import CreateRecibo from "../comprobantes/CreateRecibo"

const NotasCreditoMain = () => (
    <ComprobanteSectionMain
        icon={ScrollText}
        title="Notas de crédito"
        description="Registre notas de crédito y consulte comprobantes electrónicos emitidos."
        createTitle="Nueva nota de crédito"
        createDescription="Complete los datos para emitir una nota de crédito."
        createForm={(onDone) => <CreateRecibo variant="nota_credito" onDone={onDone} />}
        reporteTitle="Reporte de notas de crédito"
        reporteDescription="Consulte y filtre las notas de crédito emitidas."
        listVariant="recibo"
        reciboComprobanteId={RECIBO_COMPROBANTE_NOTA_CREDITO}
        anularEntityLabel="nota de crédito"
        renderReporteList={(context) => (
            <ComprobantesList
                variant="recibo"
                comprobante={RECIBO_COMPROBANTE_NOTA_CREDITO}
                entityLabel="nota de crédito"
                entityLabelPlural="notas de crédito"
                {...context}
            />
        )}
    />
)

export default NotasCreditoMain
