import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import type { Tipokardex } from "../../../services/api/tipokardexService"

const inputClass =
    "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-500"

export function emptyActo(): Acto {
    return {
        idtipoacto: "",
        desacto: "",
        actosunat: "",
        actouif: "",
        idtipkar: 0,
        umbral: 0,
        impuestos: 0,
        idcalnot: 0,
        idecalreg: 0,
        idmodelo: 0,
        rol_part: "",
        indicador: "",
        codigo_ancert: "",
        codigo_visual: "",
        tipobien_admitido: "",
        mediospago: "",
        cuantia: "",
        origenfondo: "",
        oporpago1: "",
        impuestorenta: "",
        tipoplantilla_default: "",
        nativo: "",
        novalidapatri: "",
        flag: "",
        cod_ancert: "",
    }
}

/** Rellena campos no editados en UI y alinea códigos Ancert para el API. */
export function mergeActoForApi(form: Acto): Acto {
    const anc = (form.cod_ancert ?? form.codigo_ancert ?? "").trim()
    return {
        ...emptyActo(),
        ...form,
        cod_ancert: anc,
        codigo_ancert: anc,
    }
}

interface Props {
    value: Acto
    onChange: (next: Acto) => void
    tipoKardex: Tipokardex[]
}

const ActoTipoForm = ({ value, onChange, tipoKardex }: Props) => {
    const list = Array.isArray(tipoKardex) ? tipoKardex : []

    const patch = (partial: Partial<Acto>) => {
        onChange({ ...value, ...partial })
    }

    const setCodAncert = (raw: string) => {
        patch({ cod_ancert: raw, codigo_ancert: raw })
    }

    return (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <div className="sm:col-span-2 lg:col-span-1">
                <label htmlFor="acto-idtipkar" className="text-xs font-semibold text-slate-700">
                    Tipo de kardex <span className="text-red-600">*</span>
                </label>
                <select
                    id="acto-idtipkar"
                    value={value.idtipkar && value.idtipkar !== 0 ? String(value.idtipkar) : ""}
                    onChange={(e) => {
                        const n = Number(e.target.value)
                        patch({ idtipkar: Number.isFinite(n) ? n : 0 })
                    }}
                    className={inputClass}
                >
                    <option value="">Seleccione…</option>
                    {list.map((k) => (
                        <option key={k.idtipkar} value={String(k.idtipkar)}>
                            {k.nomtipkar}
                        </option>
                    ))}
                </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
                <label htmlFor="acto-desacto" className="text-xs font-semibold text-slate-700">
                    Descripción <span className="text-red-600">*</span>
                </label>
                <input
                    id="acto-desacto"
                    value={value.desacto}
                    onChange={(e) => patch({ desacto: e.target.value })}
                    className={inputClass}
                    placeholder="Descripción del acto"
                />
            </div>
            <div>
                <label htmlFor="acto-actosunat" className="text-xs font-semibold text-slate-700">
                    Código SUNAT
                </label>
                <input
                    id="acto-actosunat"
                    value={value.actosunat}
                    onChange={(e) => patch({ actosunat: e.target.value })}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="acto-impuestos" className="text-xs font-semibold text-slate-700">
                    Impuesto
                </label>
                <input
                    id="acto-impuestos"
                    type="number"
                    value={String(value.impuestos ?? 0)}
                    onChange={(e) => {
                        const n = Number(e.target.value)
                        patch({ impuestos: Number.isFinite(n) ? n : 0 })
                    }}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="acto-actouif" className="text-xs font-semibold text-slate-700">
                    Código UIF
                </label>
                <input
                    id="acto-actouif"
                    value={value.actouif}
                    onChange={(e) => patch({ actouif: e.target.value })}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="acto-umbral" className="text-xs font-semibold text-slate-700">
                    Umbral
                </label>
                <input
                    id="acto-umbral"
                    type="number"
                    value={String(value.umbral ?? 0)}
                    onChange={(e) => {
                        const n = Number(e.target.value)
                        patch({ umbral: Number.isFinite(n) ? n : 0 })
                    }}
                    className={inputClass}
                />
            </div>
            <div>
                <label htmlFor="acto-cod-ancert" className="text-xs font-semibold text-slate-700">
                    Cod. SISGEN
                </label>
                <input
                    id="acto-cod-ancert"
                    value={value.cod_ancert || value.codigo_ancert}
                    onChange={(e) => setCodAncert(e.target.value)}
                    className={`${inputClass} font-mono`}
                />
            </div>
        </div>
    )
}

export default ActoTipoForm
