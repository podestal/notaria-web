import type { Acto } from "../../../services/api/extraprotocolares/actoService"

interface Props {
    acto: Acto
}

const ActoCondicionCard = ({ acto }: Props) => {
    return (
        <article className="rounded-lg border border-slate-200 bg-white p-4">
            <h3 className="text-sm font-semibold leading-snug text-slate-900">{acto.desacto}</h3>
            <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs text-slate-600">
                <div>
                    <dt className="font-medium text-slate-500">Tipo acto</dt>
                    <dd className="font-mono text-slate-800">{acto.idtipoacto}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">Tipo kardex</dt>
                    <dd className="text-slate-800">{acto.idtipkar}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">SUNAT</dt>
                    <dd>{acto.actosunat || "—"}</dd>
                </div>
                <div>
                    <dt className="font-medium text-slate-500">UIF</dt>
                    <dd>{acto.actouif || "—"}</dd>
                </div>
            </dl>
        </article>
    )
}

export default ActoCondicionCard
