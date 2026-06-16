import { FilePlus } from "lucide-react"
import { RECIBO_COMPROBANTE_NOTA_DEBITO } from "../../../services/taxes/recibosService"
import ComprobanteSectionMain from "../comprobantes/ComprobanteSectionMain"
import ComprobantesList from "../comprobantes/ComprobantesList"
import CreateRecibo from "../comprobantes/CreateRecibo"

const NotasDebitoMain = () => (
    <ComprobanteSectionMain
        sectionKey="notas-debito"
        icon={FilePlus}
        title="Notas de débito"
        description="Registre notas de débito y consulte comprobantes electrónicos emitidos."
        createTitle="Nueva nota de débito"
        createDescription="Complete los datos para emitir una nota de débito."
        createForm={(onDone) => <CreateRecibo variant="nota_debito" onDone={onDone} />}
        reporteTitle="Reporte de notas de débito"
        reporteDescription="Consulte y filtre las notas de débito emitidas."
        listVariant="recibo"
        reciboComprobanteId={RECIBO_COMPROBANTE_NOTA_DEBITO}
        anularEntityLabel="nota de débito"
        renderReporteList={(context) => (
            <ComprobantesList
                variant="recibo"
                comprobante={RECIBO_COMPROBANTE_NOTA_DEBITO}
                entityLabel="nota de débito"
                entityLabelPlural="notas de débito"
                {...context}
            />
        )}
    />
)

export default NotasDebitoMain
