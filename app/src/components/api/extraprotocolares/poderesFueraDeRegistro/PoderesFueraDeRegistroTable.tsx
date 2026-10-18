import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import ExtraTableShell from "../ExtraTableShell"
import PoderesFueraDeRegistroTableBody from "./PoderesFueraDeRegistroTableBody"
import PoderesFueraDeRegistroTableHeader from "./PoderesFueraDeRegistroTableHeader"

interface Props {
    poderes: IngresoPoderesPage | undefined
    page: number
    readyOnly?: boolean
}

const PoderesFueraDeRegistroTable = ({ poderes, page, readyOnly }: Props) => {
  return (
    <ExtraTableShell
      count={poderes?.count ?? 0}
      label="poderes encontrados"
      hint={readyOnly ? undefined : "Haga clic en una fila para abrir el poder"}
      minWidth="1000px"
    >
      <PoderesFueraDeRegistroTableHeader />
      <PoderesFueraDeRegistroTableBody
        poderes={poderes}
        page={page}
        readyOnly={readyOnly}
      />
    </ExtraTableShell>
  )
}

export default PoderesFueraDeRegistroTable
