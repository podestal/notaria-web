import { PermisoViajePage } from "../../../../services/api/extraprotocolares/permisoViajeService"
import PermisosTableBody from "./PermisosTableBody"
import PermisosTableHeader from "./PermisosTableHeader"

interface Props {
   permisosPage: PermisoViajePage
   readyOnly?: boolean
}

const PermisosTable = ({ permisosPage, readyOnly }: Props) => {
  return (
    <>
        <PermisosTableHeader />
        <PermisosTableBody permisosPage={permisosPage} readyOnly={readyOnly} />
    </>
  )
}

export default PermisosTable