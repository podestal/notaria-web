import type { Acto } from "../../../services/api/extraprotocolares/actoService"

interface Props {
    actos: Acto[]
}

const ActoCondicionTable = ({ actos }: Props) => {
    return (
        <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-600">
                    <tr>
                        <th className="px-4 py-3">Tipo acto</th>
                        <th className="px-4 py-3">Descripción</th>
                        <th className="px-4 py-3">Tipo kardex</th>
                        <th className="px-4 py-3">SUNAT</th>
                        <th className="px-4 py-3">UIF</th>
                        <th className="px-4 py-3">Umbral</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                    {actos.map((acto, index) => (
                        <tr key={`${acto.idtipoacto}-${acto.idtipkar}-${index}`} className="hover:bg-slate-50/80">
                            <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{acto.idtipoacto}</td>
                            <td className="max-w-md px-4 py-3 text-sm">{acto.desacto}</td>
                            <td className="whitespace-nowrap px-4 py-3">{acto.idtipkar}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs">{acto.actosunat || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-xs">{acto.actouif || "—"}</td>
                            <td className="whitespace-nowrap px-4 py-3">{acto.umbral}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default ActoCondicionTable
