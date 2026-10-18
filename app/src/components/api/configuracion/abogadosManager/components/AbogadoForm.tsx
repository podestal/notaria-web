import { FormEvent, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Loader2, Save } from "lucide-react"
import { CreateUpdateAbogado } from "../../../../../services/api/abogadosService"

export interface AbogadoFormValues {
    razonsocial: string
    direccion: string
    distrito: string
    documento: string
    telefono: string
    matricula: string
    fax: string
    sede_colegio: string
}

interface Props {
    initialValues: AbogadoFormValues
    onSubmit: (values: CreateUpdateAbogado) => Promise<void> | void
    submitLabel: string
    loading?: boolean
    onCancel?: () => void
}

const fieldShell =
    "flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 transition-shadow focus-within:border-sky-300 focus-within:shadow-md focus-within:shadow-sky-100"

const inputClass =
    "w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"

const inputErrorClass =
    "w-full min-w-0 rounded-md border border-rose-400 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-rose-400 focus:ring-2 focus:ring-rose-200"

const toNullable = (value: string) => {
    const trimmed = value.trim()
    return trimmed ? trimmed : null
}

const AbogadoForm = ({ initialValues, onSubmit, submitLabel, loading = false, onCancel }: Props) => {
    const [form, setForm] = useState<AbogadoFormValues>(initialValues)
    const [nameError, setNameError] = useState("")
    const [documentoError, setDocumentoError] = useState("")

    const documentoDigits = form.documento.replace(/\D/g, "")
    const isValidDocumentoLength = documentoDigits.length === 8 || documentoDigits.length === 11

    const isInvalid = useMemo(() => {
        return !form.razonsocial.trim() || !isValidDocumentoLength
    }, [form.razonsocial, isValidDocumentoLength])

    const validate = () => {
        let ok = true
        if (!form.razonsocial.trim()) {
            setNameError("Razón social es requerida")
            ok = false
        }
        if (!isValidDocumentoLength) {
            setDocumentoError("Documento debe tener 8 o 11 números")
            ok = false
        }
        return ok
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!validate()) return
        await onSubmit({
            razonsocial: toNullable(form.razonsocial),
            direccion: toNullable(form.direccion),
            distrito: toNullable(form.distrito),
            documento: documentoDigits,
            telefono: toNullable(form.telefono),
            matricula: toNullable(form.matricula),
            fax: toNullable(form.fax),
            sede_colegio: toNullable(form.sede_colegio),
        })
    }

    const Field = ({
        label,
        required,
        error,
        index,
        children,
        className = "",
    }: {
        label: string
        required?: boolean
        error?: string
        index: number
        children: React.ReactNode
        className?: string
    }) => (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: index * 0.03 }}
            className={`space-y-1 ${className}`}
        >
            <label className={fieldShell}>
                <span className="min-w-[6.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                    {label}
                    {required ? <span className="text-rose-500"> *</span> : null}
                </span>
                {children}
            </label>
            {error ? <p className="px-1 text-[11px] text-rose-500">{error}</p> : null}
        </motion.div>
    )

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 gap-2.5 md:grid-cols-2">
                <Field label="Razón social" required error={nameError} index={0} className="md:col-span-2">
                    <input
                        value={form.razonsocial}
                        onChange={(e) => {
                            setForm((prev) => ({ ...prev, razonsocial: e.target.value }))
                            setNameError("")
                        }}
                        className={nameError ? inputErrorClass : inputClass}
                    />
                </Field>
                <Field label="Documento" required error={documentoError} index={1}>
                    <input
                        value={form.documento}
                        onChange={(e) => {
                            const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 11)
                            setForm((prev) => ({ ...prev, documento: digitsOnly }))
                            setDocumentoError("")
                        }}
                        className={documentoError ? `${inputErrorClass} font-mono` : `${inputClass} font-mono`}
                        placeholder="8 o 11 dígitos"
                    />
                </Field>
                <Field label="Teléfono" index={2}>
                    <input
                        value={form.telefono}
                        onChange={(e) => setForm((prev) => ({ ...prev, telefono: e.target.value }))}
                        className={inputClass}
                    />
                </Field>
                <Field label="Matrícula" index={3}>
                    <input
                        value={form.matricula}
                        onChange={(e) => setForm((prev) => ({ ...prev, matricula: e.target.value }))}
                        className={inputClass}
                    />
                </Field>
                <Field label="Dirección" index={4}>
                    <input
                        value={form.direccion}
                        onChange={(e) => setForm((prev) => ({ ...prev, direccion: e.target.value }))}
                        className={inputClass}
                    />
                </Field>
                <Field label="Distrito" index={5}>
                    <input
                        value={form.distrito}
                        onChange={(e) => setForm((prev) => ({ ...prev, distrito: e.target.value }))}
                        className={inputClass}
                    />
                </Field>
                <Field label="Fax" index={6}>
                    <input
                        value={form.fax}
                        onChange={(e) => setForm((prev) => ({ ...prev, fax: e.target.value }))}
                        className={inputClass}
                    />
                </Field>
                <Field label="Sede colegio" index={7}>
                    <input
                        value={form.sede_colegio}
                        onChange={(e) => setForm((prev) => ({ ...prev, sede_colegio: e.target.value }))}
                        className={inputClass}
                    />
                </Field>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-slate-200 pt-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Cancelar
                    </button>
                )}
                <motion.button
                    type="submit"
                    disabled={loading || isInvalid}
                    whileHover={loading || isInvalid ? undefined : { y: -1 }}
                    whileTap={loading || isInvalid ? undefined : { scale: 0.96 }}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-blue-700 bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                    {loading ? "Guardando..." : submitLabel}
                </motion.button>
            </div>
        </form>
    )
}

export default AbogadoForm
