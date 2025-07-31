import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService"
import PermisosTableBody from "./PermisosTableBody"
import PermisosTableHeader from "./PermisosTableHeader"

interface Props {
   permisosPage: PermisoViajePage
}

const PermisosTable = ({ permisosPage }: Props) => {
  return (
    <>
        <PermisosTableHeader />
        <PermisosTableBody permisosPage={permisosPage} />
    </>
  )
}

export default PermisosTable