import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useUpdateMapUser from "../../../../hooks/api/users/useUpdateMapUser"
import type { ExtraProtocolarPermission, User } from "../../../../services/auth/userService"

const FALLBACK_PERMISSIONS: ExtraProtocolarPermission[] = [
    { key: "permisos_viaje", name: "Cert. Autorización de viaje", allowed: true },
    { key: "poderes", name: "Poderes Fuera de Registro", allowed: true },
    { key: "cartas", name: "Cartas Notariales", allowed: true },
    { key: "libros", name: "Cert. Apertura de Libros", allowed: true },
    { key: "supervivencia_capaz", name: "Cert. Supervivencia Persona Capaz", allowed: true },
    { key: "supervivencia_incapaz", name: "Cert. Supervivencia Persona Incapaz", allowed: true },
    { key: "domiciliario", name: "Certificado Domiciliario", allowed: true },
    { key: "cambio_caracteristicas", name: "Cambio de Características", allowed: true },
    { key: "busqueda_avanzada", name: "Búsqueda Avanzada", allowed: true },
]

interface Props {
    user: User
}

const ExtraProtocolarPermissionsToggles = ({ user }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const updateMapUser = useUpdateMapUser({ idusuario: user.idusuario })
    const permissions =
        user.extraprotocolar_permissions && user.extraprotocolar_permissions.length > 0
            ? user.extraprotocolar_permissions
            : FALLBACK_PERMISSIONS

    const handleToggle = (key: string, allowed: boolean) => {
        const next = permissions.map((item) =>
            item.key === key ? { ...item, allowed } : item,
        )
        updateMapUser.mutate(
            { access, user: { extraprotocolar_permissions: next } },
            {
                onSuccess: () => {
                    setMessage("Permisos de extraprotocolares actualizados")
                    setType("success")
                    setShow(true)
                },
                onError: (error) => {
                    const data = (
                        error as { response?: { data?: { detail?: string } } }
                    )?.response?.data
                    setMessage(
                        typeof data?.detail === "string"
                            ? data.detail
                            : "No se pudieron guardar los permisos.",
                    )
                    setType("error")
                    setShow(true)
                },
            },
        )
    }

    return (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Extraprotocolares
            </p>
            <p className="text-[11px] text-slate-500">
                Desmarque los tipos que este usuario no podrá crear ni digitar.
            </p>
            <ul className="grid gap-1.5 sm:grid-cols-2">
                {permissions.map((item) => (
                    <li key={item.key}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-xs text-slate-700 hover:bg-slate-50">
                            <input
                                type="checkbox"
                                checked={item.allowed}
                                disabled={updateMapUser.isPending}
                                onChange={(event) =>
                                    handleToggle(item.key, event.target.checked)
                                }
                                className="h-3.5 w-3.5 rounded border-slate-300 text-sky-600 focus:ring-sky-400"
                            />
                            <span>{item.name}</span>
                        </label>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ExtraProtocolarPermissionsToggles
