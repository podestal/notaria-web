import { Navigate, Outlet, useLocation } from "react-router-dom"
import useUserInfoStore from "../../../hooks/store/useGetUserInfo"
import { userCanExtraprotocolar } from "../../../services/auth/userService"

const EXTRA_PATH_TYPES: Record<string, string> = {
  "/app/extraprotocolares/permisosViaje": "permisos_viaje",
  "/app/extraprotocolares/poderesFueraDeRegistro": "poderes",
  "/app/extraprotocolares/cartaNotarial": "cartas",
  "/app/extraprotocolares/aperturaLibros": "libros",
  "/app/extraprotocolares/supervivenciaCapaz": "supervivencia_capaz",
  "/app/extraprotocolares/supervivenciaIncapaz": "supervivencia_incapaz",
  "/app/extraprotocolares/certificadoDomiciliario": "domiciliario",
  "/app/extraprotocolares/cambioCaracteristicas": "cambio_caracteristicas",
  "/app/extraprotocolares/busquedaAvanzada": "busqueda_avanzada",
}

const ExtraprotocolaresMain = () => {
  const location = useLocation()
  const user = useUserInfoStore((s) => s.user)
  const extraType = EXTRA_PATH_TYPES[location.pathname]

  if (extraType && !userCanExtraprotocolar(user, extraType)) {
    return <Navigate to="/app/extraprotocolares" replace />
  }

  return <Outlet />
}

export default ExtraprotocolaresMain
