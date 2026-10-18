import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService"
import ExtraTableShell from "../ExtraTableShell"
import PermisosTableBody from "./PermisosTableBody"
import PermisosTableHeader from "./PermisosTableHeader"

interface Props {
   permisosPage: PermisoViajePage
   readyOnly?: boolean
}

const PermisosTable = ({ permisosPage, readyOnly }: Props) => {
  return (
    <ExtraTableShell
      count={permisosPage.count}
      label="permisos encontrados"
      hint={readyOnly ? undefined : "Haga clic en una fila para abrir el permiso"}
      minWidth="1100px"
    >
      <PermisosTableHeader />
      <PermisosTableBody permisosPage={permisosPage} readyOnly={readyOnly} />
    </ExtraTableShell>
  )
}

export default PermisosTable
