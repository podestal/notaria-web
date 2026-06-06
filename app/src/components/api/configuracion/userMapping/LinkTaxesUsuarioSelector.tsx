import { useMemo, useState } from "react"
import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useGetTaxesUsuarios from "../../../../hooks/taxes/usuarios/useGetTaxesUsuarios"
import useUpdateMapUser from "../../../../hooks/api/users/useUpdateMapUser"

interface Props {
    idusuario: number
}

const LinkTaxesUsuarioSelector = ({ idusuario }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const { data: taxesUsuarios = [], isLoading, isError } = useGetTaxesUsuarios({
        access,
    })
    const updateMapUser = useUpdateMapUser({ idusuario })
    const [selectedId, setSelectedId] = useState("")

    const selectedTaxesUser = useMemo(
        () =>
            taxesUsuarios.find(
                (item) => String(item.id_usuario) === selectedId,
            ) ?? null,
        [taxesUsuarios, selectedId],
    )

    const options = useMemo(
        () =>
            taxesUsuarios.map((item) => ({
                value: String(item.id_usuario),
                label: item.email
                    ? `${item.usuario} — ${item.email}`
                    : item.usuario,
            })),
        [taxesUsuarios],
    )

    const canConfirm =
        selectedTaxesUser != null && selectedTaxesUser.negocio_id != null

    const handleConfirm = async () => {
        if (!selectedTaxesUser || selectedTaxesUser.negocio_id == null) {
            setMessage("El usuario taxes seleccionado no tiene negocio asignado")
            setType("error")
            setShow(true)
            return
        }

        await updateMapUser.mutateAsync(
            {
                access,
                user: {
                    taxes_usuario_id: selectedTaxesUser.id_usuario,
                    negocio_id: selectedTaxesUser.negocio_id,
                },
            },
            {
                onSuccess: () => {
                    setMessage("Usuario enlazado correctamente")
                    setType("success")
                    setShow(true)
                },
                onError: (error) => {
                    const data = (error as { response?: { data?: { detail?: string } } })
                        ?.response?.data
                    setMessage(
                        typeof data?.detail === "string"
                            ? data.detail
                            : "No se pudo enlazar el usuario.",
                    )
                    setType("error")
                    setShow(true)
                },
            },
        )
    }

    if (isLoading) {
        return (
            <p className="mt-3 text-xs text-slate-500 animate-pulse">
                Cargando usuarios taxes…
            </p>
        )
    }

    if (isError) {
        return (
            <p className="mt-3 text-xs text-red-600">
                No se pudo cargar la lista de usuarios taxes.
            </p>
        )
    }

    if (options.length === 0) {
        return (
            <p className="mt-3 text-xs text-slate-500">
                No hay usuarios taxes disponibles para enlazar.
            </p>
        )
    }

    return (
        <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
            <div className="grid grid-cols-3 items-center gap-2">
                <p className="pl-2 text-xs font-semibold text-slate-700">
                    Usuario taxes
                </p>
                <select
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    disabled={updateMapUser.isPending}
                    className="col-span-2 min-w-0 rounded-md border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 disabled:cursor-not-allowed disabled:bg-slate-100"
                >
                    <option value="">Seleccione usuario taxes…</option>
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {selectedTaxesUser && (
                <p className="pl-2 text-[11px] text-slate-500">
                    Se enviará{" "}
                    <span className="font-medium text-slate-700">
                        taxes_usuario_id: {selectedTaxesUser.id_usuario}
                    </span>
                    {selectedTaxesUser.negocio_id != null ? (
                        <>
                            {" "}
                            y{" "}
                            <span className="font-medium text-slate-700">
                                negocio_id: {selectedTaxesUser.negocio_id}
                            </span>
                        </>
                    ) : (
                        <span className="font-medium text-red-600">
                            {" "}
                            (sin negocio — no se puede confirmar)
                        </span>
                    )}
                </p>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={handleConfirm}
                    disabled={!canConfirm || updateMapUser.isPending}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {updateMapUser.isPending ? "Guardando…" : "Confirmar enlace"}
                </button>
            </div>
        </div>
    )
}

export default LinkTaxesUsuarioSelector
