import { FormEvent, useMemo, useState } from "react"
import { UserPlus } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useGetUsuarios from "../../../../hooks/api/usuarios/useGetUsuarios"
import useGetTaxesUsuarios from "../../../../hooks/taxes/usuarios/useGetTaxesUsuarios"
import useCreateTaxesUsuario from "../../../../hooks/taxes/usuarios/useCreateTaxesUsuario"
import {
    getUsuarioDisplayName,
    type Usuario,
} from "../../../../services/api/usuariosService"
import SimpleInput from "../../../ui/SimpleInput"

const splitLastName = (value: string) => {
    const parts = value.trim().split(/\s+/)
    return {
        apellido_paterno: parts[0] || "",
        apellido_materno: parts.slice(1).join(" "),
    }
}

const TaxesUsuariosMain = () => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createTaxesUsuario = useCreateTaxesUsuario()
    const { data: coreUsers = [], isLoading: loadingCore } = useGetUsuarios({
        access,
    })
    const { data: taxesUsers = [], isLoading: loadingTaxes } = useGetTaxesUsuarios({
        access,
    })

    const [coreUserId, setCoreUserId] = useState("")
    const [usuario, setUsuario] = useState("")
    const [nombres, setNombres] = useState("")
    const [apellidoPaterno, setApellidoPaterno] = useState("")
    const [apellidoMaterno, setApellidoMaterno] = useState("")
    const [numeroDocumento, setNumeroDocumento] = useState("")
    const [errors, setErrors] = useState<Record<string, string>>({})

    const selectedCoreUser = useMemo(
        () =>
            coreUsers.find((item) => String(item.idusuario) === coreUserId) ?? null,
        [coreUsers, coreUserId],
    )

    const applyCoreUser = (user: Usuario | null) => {
        if (!user) {
            setCoreUserId("")
            return
        }
        const apellidos = splitLastName(user.last_name || "")
        setCoreUserId(String(user.idusuario))
        setUsuario(user.username || "")
        setNombres(user.first_name || "")
        setApellidoPaterno(apellidos.apellido_paterno)
        setApellidoMaterno(apellidos.apellido_materno)
        setErrors({})
    }

    const resetForm = () => {
        setCoreUserId("")
        setUsuario("")
        setNombres("")
        setApellidoPaterno("")
        setApellidoMaterno("")
        setNumeroDocumento("")
        setErrors({})
    }

    const validate = () => {
        const next: Record<string, string> = {}
        if (!usuario.trim()) next.usuario = "El usuario es obligatorio"
        if (!nombres.trim()) next.nombres = "Los nombres son obligatorios"
        if (!apellidoPaterno.trim()) {
            next.apellido_paterno = "El apellido paterno es obligatorio"
        }
        if (!numeroDocumento.trim()) {
            next.numero_documento = "El número de documento es obligatorio"
        }
        setErrors(next)
        return Object.keys(next).length === 0
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!validate()) return

        const apellidoMaternoTrim = apellidoMaterno.trim()
        try {
            await createTaxesUsuario.mutateAsync({
                access,
                payload: {
                    usuario: usuario.trim(),
                    negocio_id: 1,
                    ...(selectedCoreUser
                        ? { idusuario: selectedCoreUser.idusuario }
                        : {}),
                    persona: {
                        nombres: nombres.trim(),
                        apellido_paterno: apellidoPaterno.trim(),
                        ...(apellidoMaternoTrim
                            ? { apellido_materno: apellidoMaternoTrim }
                            : {}),
                        numero_documento: numeroDocumento.trim(),
                    },
                },
            })
            setType("success")
            setMessage("Usuario taxes creado correctamente")
            setShow(true)
            resetForm()
        } catch (error) {
            const data = (
                error as { response?: { data?: Record<string, unknown> } }
            )?.response?.data
            const detail =
                typeof data?.detail === "string"
                    ? data.detail
                    : typeof data?.message === "string"
                      ? data.message
                      : "No se pudo crear el usuario taxes."
            setType("error")
            setMessage(detail)
            setShow(true)
        }
    }

    return (
        <section className="space-y-4 px-4 py-6">
            <header>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    Facturación
                </p>
                <h1 className="text-2xl font-bold text-slate-900">Usuarios taxes</h1>
                <p className="mt-1 text-sm text-slate-500">
                    Cree un usuario de facturación. Si ya existe en el core, selecciónelo
                    para enviar su idusuario.
                </p>
            </header>

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
            >
                <div className="mb-4 flex items-start gap-3 border-b border-slate-100 pb-3">
                    <div className="rounded-xl border border-sky-400/20 bg-sky-500/10 p-2">
                        <UserPlus className="h-5 w-5 text-sky-600" aria-hidden />
                    </div>
                    <div>
                        <h2 className="text-sm font-semibold text-slate-800">
                            Nuevo usuario taxes
                        </h2>
                        <p className="mt-0.5 text-xs text-slate-500">
                            {selectedCoreUser
                                ? `Vinculado al usuario core #${selectedCoreUser.idusuario}`
                                : "Sin usuario core — se creará solo en taxes."}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label className="mb-1 block pl-2 text-xs font-semibold text-slate-700">
                                Usuario core
                            </label>
                            <select
                                value={coreUserId}
                                onChange={(e) => {
                                    const next = coreUsers.find(
                                        (item) => String(item.idusuario) === e.target.value,
                                    )
                                    applyCoreUser(next ?? null)
                                }}
                                disabled={loadingCore || createTaxesUsuario.isPending}
                                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 disabled:bg-slate-100"
                            >
                                <option value="">Sin usuario core (solo taxes)</option>
                                {coreUsers.map((item) => (
                                    <option key={item.idusuario} value={String(item.idusuario)}>
                                        {item.username} — {getUsuarioDisplayName(item)} (#{item.idusuario})
                                    </option>
                                ))}
                            </select>
                            {loadingCore && (
                                <p className="mt-1 pl-2 text-[11px] text-slate-500">
                                    Cargando usuarios core…
                                </p>
                            )}
                        </div>

                        <SimpleInput
                            label="Usuario"
                            value={usuario}
                            setValue={(value) => {
                                setUsuario(value)
                                setErrors((prev) => ({ ...prev, usuario: "" }))
                            }}
                            error={errors.usuario}
                            required
                            fullWidth
                        />

                        <SimpleInput
                            label="N° documento"
                            value={numeroDocumento}
                            setValue={(value) => {
                                setNumeroDocumento(value)
                                setErrors((prev) => ({ ...prev, numero_documento: "" }))
                            }}
                            error={errors.numero_documento}
                            required
                            fullWidth
                        />

                        <SimpleInput
                            label="Nombres"
                            value={nombres}
                            setValue={(value) => {
                                setNombres(value)
                                setErrors((prev) => ({ ...prev, nombres: "" }))
                            }}
                            error={errors.nombres}
                            required
                            fullWidth
                        />

                        <SimpleInput
                            label="Apellido paterno"
                            value={apellidoPaterno}
                            setValue={(value) => {
                                setApellidoPaterno(value)
                                setErrors((prev) => ({ ...prev, apellido_paterno: "" }))
                            }}
                            error={errors.apellido_paterno}
                            required
                            fullWidth
                        />

                        <SimpleInput
                            label="Apellido materno"
                            value={apellidoMaterno}
                            setValue={setApellidoMaterno}
                            fullWidth
                        />
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                        <button
                            type="button"
                            onClick={resetForm}
                            disabled={createTaxesUsuario.isPending}
                            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Limpiar
                        </button>
                        <button
                            type="submit"
                            disabled={createTaxesUsuario.isPending}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {createTaxesUsuario.isPending
                                ? "Creando…"
                                : "Crear usuario taxes"}
                        </button>
                    </div>
                </div>
            </form>

            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <h2 className="mb-3 text-sm font-semibold text-slate-800">
                    Usuarios taxes existentes
                </h2>
                {loadingTaxes ? (
                    <p className="py-6 text-center text-sm text-slate-500 animate-pulse">
                        Cargando usuarios taxes…
                    </p>
                ) : taxesUsers.length === 0 ? (
                    <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 py-8 text-center text-sm text-slate-500">
                        Aún no hay usuarios taxes.
                    </p>
                ) : (
                    <ul className="divide-y divide-slate-100">
                        {taxesUsers.map((item) => (
                            <li
                                key={item.id_usuario}
                                className="flex flex-wrap items-center justify-between gap-2 py-2 text-sm"
                            >
                                <div>
                                    <p className="font-semibold text-slate-800">
                                        {item.usuario}
                                    </p>
                                    <p className="text-xs text-slate-500">
                                        id {item.id_usuario}
                                        {item.email ? ` · ${item.email}` : ""}
                                    </p>
                                </div>
                                <p className="text-xs text-slate-500">
                                    negocio {item.negocio_id ?? "—"}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    )
}

export default TaxesUsuariosMain
