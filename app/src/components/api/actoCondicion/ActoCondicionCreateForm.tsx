import { useState, type ChangeEvent, type FormEvent } from "react"
import type { ActoCondicion } from "../../../services/api/actoCondicionService"
import useAuthStore from "../../../store/useAuthStore"
import useCreateActoCondicion from "../../../hooks/api/actoCondicion/useCreateActoCondicion"

const inputClass =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"

interface Props {
    idtipoacto: string
    disabled?: boolean
}

type Fields = {
    idcondicion: string
    condicion: string
    parte: string
    uif: string
    formulario: string
    montop: string
    totorgante: string
    condicionsisgen: string
    codconsisgen: string
    parte_generacion: string
}

const emptyFields = (): Fields => ({
    idcondicion: "",
    condicion: "",
    parte: "",
    uif: "",
    formulario: "",
    montop: "",
    totorgante: "",
    condicionsisgen: "",
    codconsisgen: "",
    parte_generacion: "",
})

const ActoCondicionCreateForm = ({ idtipoacto, disabled = false }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const [f, setF] = useState(emptyFields)
    const [localError, setLocalError] = useState<string | null>(null)
    const [okMsg, setOkMsg] = useState<string | null>(null)
    const create = useCreateActoCondicion()

    const set =
        (key: keyof Fields) =>
        (e: ChangeEvent<HTMLInputElement>) => {
            setF((prev) => ({ ...prev, [key]: e.target.value }))
        }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        setLocalError(null)
        setOkMsg(null)
        const idc = f.idcondicion.trim()
        const cond = f.condicion.trim()
        const idta = idtipoacto.trim()
        if (!idta) {
            setLocalError("Falta id de tipo de acto.")
            return
        }
        if (!idc) {
            setLocalError("El id de condición es obligatorio (máx. 3 caracteres).")
            return
        }
        if (idc.length > 3) {
            setLocalError("El id de condición admite como máximo 3 caracteres.")
            return
        }
        if (!cond) {
            setLocalError("El texto de condición es obligatorio.")
            return
        }
        if (!access) {
            setLocalError("Debe iniciar sesión.")
            return
        }

        const body: ActoCondicion = {
            idcondicion: idc,
            idtipoacto: idta,
            condicion: cond,
        }
        const opt = (v: string) => v.trim()
        if (opt(f.parte)) body.parte = opt(f.parte)
        if (opt(f.uif)) body.uif = opt(f.uif)
        if (opt(f.formulario)) body.formulario = opt(f.formulario)
        if (opt(f.montop)) body.montop = opt(f.montop)
        if (opt(f.totorgante)) body.totorgante = opt(f.totorgante)
        if (opt(f.condicionsisgen)) body.condicionsisgen = opt(f.condicionsisgen)
        if (opt(f.codconsisgen)) body.codconsisgen = opt(f.codconsisgen)
        if (opt(f.parte_generacion)) body.parte_generacion = opt(f.parte_generacion)

        create.mutate(
            { access, body },
            {
                onSuccess: () => {
                    setF(emptyFields())
                    setOkMsg("Condición creada.")
                },
                onError: (err: Error) => {
                    setLocalError(err instanceof Error ? err.message : "Error al crear la condición.")
                },
            }
        )
    }

    return (
        <div className="mb-4 rounded-lg border border-slate-200 bg-slate-50/80 p-4">
            <h4 className="text-sm font-semibold text-slate-800">Nueva condición</h4>
            <p className="mt-0.5 text-xs text-slate-500">
                Tipo de acto: <span className="font-mono font-medium text-slate-700">{idtipoacto.trim() || "—"}</span>
            </p>

            <form onSubmit={handleSubmit} className="mt-3 space-y-3">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                        <label htmlFor="nueva-cond-id" className="text-xs font-semibold text-slate-700">
                            Id condición <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="nueva-cond-id"
                            value={f.idcondicion}
                            onChange={set("idcondicion")}
                            maxLength={3}
                            className={`${inputClass} font-mono`}
                            placeholder="001"
                            disabled={disabled || !access}
                        />
                    </div>
                    <div className="sm:col-span-2 lg:col-span-2">
                        <label htmlFor="nueva-cond-texto" className="text-xs font-semibold text-slate-700">
                            Condición <span className="text-red-600">*</span>
                        </label>
                        <input
                            id="nueva-cond-texto"
                            value={f.condicion}
                            onChange={set("condicion")}
                            className={inputClass}
                            placeholder="Descripción de la condición"
                            disabled={disabled || !access}
                        />
                    </div>
                    <div>
                        <label htmlFor="nueva-cond-parte" className="text-xs font-semibold text-slate-700">
                            Parte
                        </label>
                        <input
                            id="nueva-cond-parte"
                            value={f.parte}
                            onChange={set("parte")}
                            className={inputClass}
                            disabled={disabled || !access}
                        />
                    </div>
                    <div>
                        <label htmlFor="nueva-cond-uif" className="text-xs font-semibold text-slate-700">
                            UIF
                        </label>
                        <input id="nueva-cond-uif" value={f.uif} onChange={set("uif")} className={inputClass} disabled={disabled || !access} />
                    </div>
                    <div>
                        <label htmlFor="nueva-cond-form" className="text-xs font-semibold text-slate-700">
                            Formulario
                        </label>
                        <input
                            id="nueva-cond-form"
                            value={f.formulario}
                            onChange={set("formulario")}
                            className={inputClass}
                            disabled={disabled || !access}
                        />
                    </div>
                    <div>
                        <label htmlFor="nueva-cond-montop" className="text-xs font-semibold text-slate-700">
                            Monto p.
                        </label>
                        <input
                            id="nueva-cond-montop"
                            value={f.montop}
                            onChange={set("montop")}
                            className={inputClass}
                            disabled={disabled || !access}
                        />
                    </div>
                    <div>
                        <label htmlFor="nueva-cond-totorg" className="text-xs font-semibold text-slate-700">
                            Tot. otorgante
                        </label>
                        <input
                            id="nueva-cond-totorg"
                            value={f.totorgante}
                            onChange={set("totorgante")}
                            maxLength={2}
                            className={inputClass}
                            disabled={disabled || !access}
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="nueva-cond-sisgen" className="text-xs font-semibold text-slate-700">
                            Cond. Sisgen
                        </label>
                        <input
                            id="nueva-cond-sisgen"
                            value={f.condicionsisgen}
                            onChange={set("condicionsisgen")}
                            className={inputClass}
                            disabled={disabled || !access}
                        />
                    </div>
                    <div>
                        <label htmlFor="nueva-cond-codcons" className="text-xs font-semibold text-slate-700">
                            Cod. cons.
                        </label>
                        <input
                            id="nueva-cond-codcons"
                            value={f.codconsisgen}
                            onChange={set("codconsisgen")}
                            maxLength={5}
                            className={`${inputClass} font-mono`}
                            disabled={disabled || !access}
                        />
                    </div>
                    <div>
                        <label htmlFor="nueva-cond-partegen" className="text-xs font-semibold text-slate-700">
                            Parte gen.
                        </label>
                        <input
                            id="nueva-cond-partegen"
                            value={f.parte_generacion}
                            onChange={set("parte_generacion")}
                            maxLength={1}
                            className={inputClass}
                            disabled={disabled || !access}
                        />
                    </div>
                </div>

                {localError && <p className="text-sm text-red-600">{localError}</p>}
                {okMsg && <p className="text-sm text-emerald-700">{okMsg}</p>}
                {create.isError && !localError && (
                    <p className="text-sm text-red-600">
                        {create.error instanceof Error ? create.error.message : "Error al crear."}
                    </p>
                )}

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={disabled || !access || create.isPending}
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {create.isPending ? "Guardando…" : "Agregar condición"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default ActoCondicionCreateForm
