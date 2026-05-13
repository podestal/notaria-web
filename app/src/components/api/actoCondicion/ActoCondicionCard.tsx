import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import type { Tipokardex } from "../../../services/api/tipokardexService"
import { tipokarDescripcion } from "../../../utils/actoTipokarLabel"

interface Props {
    acto: Acto
    tiposKardex: Tipokardex[]
    onSelectActo: (acto: Acto) => void
}

const ActoCondicionCard = ({ acto, tiposKardex, onSelectActo }: Props) => {
    return (
        <button
            type="button"
            className="w-full rounded-lg border border-slate-200 bg-white p-4 text-left transition hover:border-blue-300 hover:bg-blue-50/40 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200"
            onClick={() => onSelectActo(acto)}
        >
            <h3 className="text-sm font-semibold leading-snug text-slate-900">{acto.desacto}</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-600">
                <div>
                    <dt className="font-medium text-slate-500">Tipo acto</dt>
                    <dd className="font-mono text-slate-800">{acto.idtipoacto}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">Tipo kardex</dt>
                    <dd className="text-slate-800">{tipokarDescripcion(acto.idtipkar, tiposKardex)}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">Cód. SUNAT</dt>
                    <dd>{acto.actosunat || "—"}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">Impuesto</dt>
                    <dd>{acto.impuestos}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">Cód. UIF</dt>
                    <dd>{acto.actouif || "—"}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">Umbral</dt>
                    <dd>{acto.umbral}</dd>
                </div>
                <div className="col-span-2">
                    <dt className="font-medium text-slate-500">Cod. SISGEN</dt>
                    <dd className="font-mono">{(acto.cod_ancert || acto.codigo_ancert || "").trim() || "—"}</dd>
                </div>
            </dl>
        </button>
    )
}

export default ActoCondicionCard
