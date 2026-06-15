import { FormEvent, useEffect, useMemo, useState } from "react"
import useAuthStore from "../../../store/useAuthStore"
import useGetDocumentos from "../../../hooks/taxes/documentos/useGetDocumentos"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import type { CreateUpdatePersona } from "../../../services/taxes/personasService"
import { lookupReniecByDni } from "../../../utils/reniecLookup"
import { lookupSunatByRuc } from "../../../utils/sunatLookup"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import {
    formValuesToPersonaPayload,
    getDocumentKind,
    isPersonaJuridica,
    sanitizeNumeroDocumento,
    validateEmail,
    validateNumeroDocumento,
    type PersonaFormValues,
} from "./personaFormShared"

interface Props {
    initialValues: PersonaFormValues
    onSubmit: (values: CreateUpdatePersona) => Promise<void> | void
    submitLabel: string
    loading?: boolean
    onCancel?: () => void
}

const PersonaForm = ({
    initialValues,
    onSubmit,
    submitLabel,
    loading = false,
    onCancel,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const { data: documentos = [], isLoading: loadingDocumentos } = useGetDocumentos({
        access,
    })

    const [form, setForm] = useState<PersonaFormValues>(initialValues)
    const [loadingLookup, setLoadingLookup] = useState(false)
    const [documentoError, setDocumentoError] = useState("")
    const [numeroDocumentoError, setNumeroDocumentoError] = useState("")
    const [nombresError, setNombresError] = useState("")
    const [apellidoPaternoError, setApellidoPaternoError] = useState("")
    const [apellidoMaternoError, setApellidoMaternoError] = useState("")
    const [razonSocialError, setRazonSocialError] = useState("")
    const [fechaNacimientoError, setFechaNacimientoError] = useState("")
    const [direccionError, setDireccionError] = useState("")
    const [emailError, setEmailError] = useState("")

    const documentKind = useMemo(
        () => getDocumentKind(form.documento, documentos),
        [form.documento, documentos],
    )
    const isJuridica = isPersonaJuridica(documentKind)

    const documentoOptions = useMemo(
        () => [
            { value: 0, label: "Seleccione…" },
            ...documentos.map((doc) => ({
                value: doc.id_documento,
                label: doc.abreviatura
                    ? `${doc.abreviatura} — ${doc.descripcion}`
                    : doc.descripcion,
            })),
        ],
        [documentos],
    )

    useEffect(() => {
        setForm(initialValues)
    }, [initialValues])

    const validate = () => {
        let ok = true

        if (form.documento <= 0) {
            setDocumentoError("Seleccione un tipo de documento")
            ok = false
        }

        const numeroError = validateNumeroDocumento(form.numero_documento, documentKind)
        if (numeroError) {
            setNumeroDocumentoError(numeroError)
            ok = false
        }

        if (isJuridica) {
            if (!form.razon_social.trim()) {
                setRazonSocialError("La razón social es obligatoria")
                ok = false
            }
        } else {
            if (!form.nombres.trim()) {
                setNombresError("Los nombres son obligatorios")
                ok = false
            }
            if (!form.apellido_paterno.trim()) {
                setApellidoPaternoError("El apellido paterno es obligatorio")
                ok = false
            }
            if (!form.apellido_materno.trim()) {
                setApellidoMaternoError("El apellido materno es obligatorio")
                ok = false
            }
            if (!form.fecha_nacimiento.trim()) {
                setFechaNacimientoError("La fecha de nacimiento es obligatoria")
                ok = false
            }
        }

        if (!form.direccion.trim()) {
            setDireccionError("La dirección es obligatoria")
            ok = false
        }

        const emailValidationError = validateEmail(form.email)
        if (emailValidationError) {
            setEmailError(emailValidationError)
            ok = false
        }

        return ok
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit(formValuesToPersonaPayload(form, documentKind))
    }

    const handleReniec = async () => {
        const numeroError = validateNumeroDocumento(form.numero_documento, "dni")
        if (numeroError) {
            setNumeroDocumentoError(numeroError)
            setMessage(numeroError)
            setType("error")
            setShow(true)
            return
        }

        setLoadingLookup(true)
        try {
            const data = await lookupReniecByDni(form.numero_documento)
            setForm((prev) => ({
                ...prev,
                nombres: data.nombres || prev.nombres,
                apellido_paterno: data.apellido_paterno || prev.apellido_paterno,
                apellido_materno: data.apellido_materno || prev.apellido_materno,
                fecha_nacimiento: data.fecha_nacimiento || prev.fecha_nacimiento,
                direccion: data.direccion || prev.direccion,
            }))
            setNombresError("")
            setApellidoPaternoError("")
            setApellidoMaternoError("")
            setFechaNacimientoError("")
            if (data.direccion) {
                setDireccionError("")
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "No se pudo consultar RENIEC."
            setMessage(message)
            setType("error")
            setShow(true)
        } finally {
            setLoadingLookup(false)
        }
    }

    const handleSunat = async () => {
        const numeroError = validateNumeroDocumento(form.numero_documento, "ruc")
        if (numeroError) {
            setNumeroDocumentoError(numeroError)
            setMessage(numeroError)
            setType("error")
            setShow(true)
            return
        }

        setLoadingLookup(true)
        try {
            const data = await lookupSunatByRuc(form.numero_documento)
            setForm((prev) => ({
                ...prev,
                razon_social: data.razon_social || prev.razon_social,
                direccion: data.direccion || prev.direccion,
            }))
            setRazonSocialError("")
            if (data.direccion) {
                setDireccionError("")
            }
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "No se pudo consultar SUNAT."
            setMessage(message)
            setType("error")
            setShow(true)
        } finally {
            setLoadingLookup(false)
        }
    }

    const handleDocumentoChange = (value: number) => {
        const newKind = getDocumentKind(value, documentos)
        setForm((prev) => ({
            ...prev,
            documento: value,
            numero_documento: sanitizeNumeroDocumento(prev.numero_documento, newKind),
            ...(isPersonaJuridica(newKind)
                ? {
                      nombres: "",
                      apellido_paterno: "",
                      apellido_materno: "",
                      fecha_nacimiento: "",
                  }
                : {
                      razon_social: "",
                      nombre_comercial: "",
                  }),
        }))
        setDocumentoError("")
        setNumeroDocumentoError("")
        setNombresError("")
        setApellidoPaternoError("")
        setApellidoMaternoError("")
        setRazonSocialError("")
        setFechaNacimientoError("")
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {loadingDocumentos ? (
                <p className="text-xs text-slate-500 animate-pulse">
                    Cargando tipos de documento…
                </p>
            ) : (
                <SimpleSelector
                    key={`documento-${form.documento}-${documentoOptions.length}`}
                    label="Tipo documento"
                    options={documentoOptions}
                    defaultValue={form.documento}
                    setter={handleDocumentoChange}
                    error={documentoError}
                    required
                    disabled={documentoOptions.length <= 1}
                />
            )}

            <SimpleInput
                label="Número de documento"
                value={form.numero_documento}
                setValue={(value) => {
                    setForm((prev) => ({
                        ...prev,
                        numero_documento: sanitizeNumeroDocumento(value, documentKind),
                    }))
                    setNumeroDocumentoError("")
                }}
                error={numeroDocumentoError}
                required
                horizontal
                suffix={
                    documentKind === "dni" ? (
                        <button
                            type="button"
                            onClick={handleReniec}
                            disabled={loadingLookup || loading}
                            className="shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingLookup ? "…" : "RENIEC"}
                        </button>
                    ) : documentKind === "ruc" ? (
                        <button
                            type="button"
                            onClick={handleSunat}
                            disabled={loadingLookup || loading}
                            className="shrink-0 rounded-md border border-slate-300 bg-white px-2.5 py-2 text-[11px] font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loadingLookup ? "…" : "SUNAT"}
                        </button>
                    ) : undefined
                }
            />

            {isJuridica ? (
                <>
                    <SimpleInput
                        label="Razón social"
                        value={form.razon_social}
                        setValue={(value) => {
                            setForm((prev) => ({ ...prev, razon_social: value }))
                            setRazonSocialError("")
                        }}
                        error={razonSocialError}
                        required
                        horizontal
                    />
                    <SimpleInput
                        label="Nombre comercial"
                        value={form.nombre_comercial}
                        setValue={(value) => {
                            setForm((prev) => ({ ...prev, nombre_comercial: value }))
                        }}
                        horizontal
                    />
                </>
            ) : (
                <>
                    <SimpleInput
                        label="Nombres"
                        value={form.nombres}
                        setValue={(value) => {
                            setForm((prev) => ({ ...prev, nombres: value }))
                            setNombresError("")
                        }}
                        error={nombresError}
                        required
                        horizontal
                    />
                    <SimpleInput
                        label="Apellido paterno"
                        value={form.apellido_paterno}
                        setValue={(value) => {
                            setForm((prev) => ({ ...prev, apellido_paterno: value }))
                            setApellidoPaternoError("")
                        }}
                        error={apellidoPaternoError}
                        required
                        horizontal
                    />
                    <SimpleInput
                        label="Apellido materno"
                        value={form.apellido_materno}
                        setValue={(value) => {
                            setForm((prev) => ({ ...prev, apellido_materno: value }))
                            setApellidoMaternoError("")
                        }}
                        error={apellidoMaternoError}
                        required
                        horizontal
                    />
                    <SimpleInput
                        label="Fecha de nacimiento"
                        type="date"
                        value={form.fecha_nacimiento}
                        setValue={(value) => {
                            setForm((prev) => ({ ...prev, fecha_nacimiento: value }))
                            setFechaNacimientoError("")
                        }}
                        error={fechaNacimientoError}
                        required
                        horizontal
                    />
                </>
            )}

            <SimpleInput
                label="Dirección"
                value={form.direccion}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, direccion: value }))
                    setDireccionError("")
                }}
                error={direccionError}
                required
                horizontal
            />
            <SimpleInput
                label="Correo electrónico"
                type="email"
                value={form.email}
                setValue={(value) => {
                    setForm((prev) => ({ ...prev, email: value }))
                    setEmailError("")
                }}
                error={emailError}
                horizontal
            />

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading || loadingDocumentos}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Guardando…" : submitLabel}
                </button>
            </div>
        </form>
    )
}

export default PersonaForm
