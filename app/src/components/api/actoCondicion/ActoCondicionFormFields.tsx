import type { ChangeEvent } from "react"
import {
    ActoCondicionFields,
    controlShellClass,
    inputClass,
    labelClass,
    MONTOP_OPTIONS,
    PARTE_OPTIONS,
    UIF_OPTIONS,
} from "./actoCondicionFormShared"

interface Props {
    idPrefix: string
    value: ActoCondicionFields
    onChange: (next: ActoCondicionFields) => void
    disabled?: boolean
}

const ActoCondicionFormFields = ({ idPrefix, value: f, onChange, disabled = false }: Props) => {
    const set =
        (key: keyof Omit<ActoCondicionFields, "formularioChecked">) =>
        (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
            onChange({ ...f, [key]: e.target.value })
        }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="sm:col-span-2 lg:col-span-2">
                <label htmlFor={`${idPrefix}-condicion`} className={labelClass}>
                    Condición <span className="text-red-600">*</span>
                </label>
                <input
                    id={`${idPrefix}-condicion`}
                    value={f.condicion}
                    onChange={set("condicion")}
                    className={inputClass}
                    placeholder="Descripción de la condición"
                    disabled={disabled}
                />
            </div>
            <div>
                <label htmlFor={`${idPrefix}-parte`} className={labelClass}>
                    Parte
                </label>
                <select
                    id={`${idPrefix}-parte`}
                    value={f.parte}
                    onChange={set("parte")}
                    className={inputClass}
                    disabled={disabled}
                >
                    {PARTE_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor={`${idPrefix}-uif`} className={labelClass}>
                    UIF
                </label>
                <select
                    id={`${idPrefix}-uif`}
                    value={f.uif}
                    onChange={set("uif")}
                    className={inputClass}
                    disabled={disabled}
                >
                    {UIF_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <p id={`${idPrefix}-form-label`} className={labelClass}>
                    Formulario
                </p>
                <div className={controlShellClass} role="group" aria-labelledby={`${idPrefix}-form-label`}>
                    <label
                        htmlFor={`${idPrefix}-form`}
                        className="flex w-full cursor-pointer items-center gap-2.5 text-sm text-slate-800"
                    >
                        <input
                            id={`${idPrefix}-form`}
                            type="checkbox"
                            checked={f.formularioChecked}
                            onChange={(e) => onChange({ ...f, formularioChecked: e.target.checked })}
                            disabled={disabled}
                            className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="leading-none">Sí</span>
                    </label>
                </div>
            </div>
            <div>
                <label htmlFor={`${idPrefix}-montop`} className={labelClass}>
                    Monto p.
                </label>
                <select
                    id={`${idPrefix}-montop`}
                    value={f.montop}
                    onChange={set("montop")}
                    className={inputClass}
                    disabled={disabled}
                >
                    {MONTOP_OPTIONS.map((o) => (
                        <option key={o.value || "empty"} value={o.value}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor={`${idPrefix}-totorg`} className={labelClass}>
                    Tot. otorgante
                </label>
                <input
                    id={`${idPrefix}-totorg`}
                    value={f.totorgante}
                    onChange={set("totorgante")}
                    maxLength={2}
                    className={inputClass}
                    disabled={disabled}
                />
            </div>
            <div className="sm:col-span-2">
                <label htmlFor={`${idPrefix}-sisgen`} className={labelClass}>
                    Condición SISGEN
                </label>
                <input
                    id={`${idPrefix}-sisgen`}
                    value={f.condicionsisgen}
                    onChange={set("condicionsisgen")}
                    className={inputClass}
                    disabled={disabled}
                />
            </div>
            <div>
                <label htmlFor={`${idPrefix}-codcons`} className={labelClass}>
                    Código SISGEN
                </label>
                <input
                    id={`${idPrefix}-codcons`}
                    value={f.codconsisgen}
                    onChange={set("codconsisgen")}
                    maxLength={5}
                    className={`${inputClass} font-mono`}
                    disabled={disabled}
                />
            </div>
        </div>
    )
}

export default ActoCondicionFormFields
