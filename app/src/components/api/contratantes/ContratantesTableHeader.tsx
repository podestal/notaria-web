import { CONTRATANTES_GRID } from "./contratantesGrid"

const ContratantesTableHeader = () => (
    <div
        className="sticky top-0 z-10 grid items-center gap-3 border-b border-slate-200 bg-slate-50/95 px-4 py-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 backdrop-blur"
        style={{ gridTemplateColumns: CONTRATANTES_GRID }}
    >
        <p>Contratante</p>
        <p>Condición</p>
        <p className="text-center">Firma</p>
        <p>Fecha firma</p>
        <p>Responsable</p>
        <p className="text-center">Acciones</p>
    </div>
)

export default ContratantesTableHeader
