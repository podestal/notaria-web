import { Domiciliario } from "../../../../services/api/extraprotocolares/domiciliarioService";
import ExtraTableShell from "../ExtraTableShell"
import DomiciliarioTableBody from "./DomiciliarioTableBody"
import DomiciliarioTableHeader from "./DomiciliarioTableHeader"

interface Props {
    domiciliarios: Domiciliario[];
    page: number;
    readyOnly?: boolean;
    totalCount?: number;
}

const DomiciliarioTable = ({ domiciliarios, page, readyOnly, totalCount }: Props) => {
  return (
    <ExtraTableShell
      count={totalCount ?? domiciliarios.length}
      label="certificados encontrados"
      hint={readyOnly ? undefined : "Haga clic en una fila para abrir el certificado"}
      minWidth="960px"
    >
      <DomiciliarioTableHeader />
      <DomiciliarioTableBody
        domiciliarios={domiciliarios}
        page={page}
        readyOnly={readyOnly}
      />
    </ExtraTableShell>
  )
}

export default DomiciliarioTable
