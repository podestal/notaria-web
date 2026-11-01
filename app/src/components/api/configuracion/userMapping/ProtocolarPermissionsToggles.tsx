import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useUpdateMapUser from "../../../../hooks/api/users/useUpdateMapUser"
import type { ProtocolarPermission, User } from "../../../../services/auth/userService"

const FALLBACK_PERMISSIONS: ProtocolarPermission[] = [
    { idtipkar: 1, name: "Escrituras Públicas", allowed: true },
    { idtipkar: 2, name: "Asuntos No Contenciosos", allowed: true },
    { idtipkar: 3, name: "Transferencias Vehiculares", allowed: true },
    { idtipkar: 4, name: "Garantías Mobiliarias", allowed: true },
    { idtipkar: 5, name: "Testamentos", allowed: true },
]

interface Props {
    user: User
}

const ProtocolarPermissionsToggles = ({ user }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const updateMapUser = useUpdateMapUser({ idusuario: user.idusuario })
    const permissions =
        user.protocolar_permissions && user.protocolar_permissions.length > 0
            ? user.protocolar_permissions
            : FALLBACK_PERMISSIONS

    const handleToggle = (idtipkar: number, allowed: boolean) => {
        const next = permissions.map((item) =>
            item.idtipkar === idtipkar ? { ...item, allowed } : item,
        )
        updateMapUser.mutate(
            { access, user: { protocolar_permissions: next } },
            {
                onSuccess: () => {
                    setMessage("Permisos de protocolares actualizados")
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
                Protocolares
            </p>
            <p className="text-[11px] text-slate-500">
                Desmarque los tipos que este usuario no podrá crear ni digitar.
            </p>
            <ul className="grid gap-1.5 sm:grid-cols-2">
                {permissions.map((item) => (
                    <li key={item.idtipkar}>
                        <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-xs text-slate-700 hover:bg-slate-50">
                            <input
                                type="checkbox"
                                checked={item.allowed}
                                disabled={updateMapUser.isPending}
                                onChange={(event) =>
                                    handleToggle(item.idtipkar, event.target.checked)
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

export default ProtocolarPermissionsToggles
