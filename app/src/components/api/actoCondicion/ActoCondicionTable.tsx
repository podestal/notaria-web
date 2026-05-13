import type { Acto } from "../../../services/api/extraprotocolares/actoService"
import type { Tipokardex } from "../../../services/api/tipokardexService"
import { tipokarDescripcion } from "../../../utils/actoTipokarLabel"

interface Props {
    actos: Acto[]
    tiposKardex: Tipokardex[]
    onSelectActo: (acto: Acto) => void
}

const ActoCondicionTable = ({ actos, tiposKardex, onSelectActo }: Props) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <tr>
                        <th className="px-4 py-3">Tipo acto</th>
                        <th className="px-4 py-3">Descripción</th>
                        <th className="px-4 py-3">Tipo kardex</th>
                        <th className="px-4 py-3">Cód. SUNAT</th>
                        <th className="px-4 py-3">Impuesto</th>
                        <th className="px-4 py-3">Cód. UIF</th>
                        <th className="px-4 py-3">Umbral</th>
                        <th className="px-4 py-3">Cod. SISGEN</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                    {actos.map((acto, index) => (
                        <tr
                            key={`${acto.idtipoacto}-${acto.idtipkar}-${index}`}
                            role="button"
                            tabIndex={0}
                            className="cursor-pointer hover:bg-blue-50/80 focus:bg-blue-50/80 focus:outline-none"
                            onClick={() => onSelectActo(acto)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                    e.preventDefault()
                                    onSelectActo(acto)
                                }
                            }}
                        >
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{acto.idtipoacto}</td>
                            <td className="max-w-md px-4 py-3 text-sm">{acto.desacto}</td>
                            <td className="max-w-[12rem] px-4 py-3 text-sm text-slate-700">
                                {tipokarDescripcion(acto.idtipkar, tiposKardex)}
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs">{acto.actosunat || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-3">{acto.impuestos}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs">{acto.actouif || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-3">{acto.umbral}</td>
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                                {(acto.cod_ancert || acto.codigo_ancert || "").trim() || "—"}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ActoCondicionTable
