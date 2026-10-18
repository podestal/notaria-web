import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService"
import { PERMISO_VIAJE_CONDICIONES, PERMISO_VIAJE_ASUNTOS } from "../../../../data/permisoViajeData"
import TopModal from "../../../ui/TopModal";
import { useState } from "react";
import { motion } from "framer-motion";
import UpdatePermiso from "./UpdatePermiso";
import getTitleCase from "../../../../utils/getTitleCase";
import { rowMotionProps } from "../rowMotion";
import { EXTRA_ID_BADGE_CLASS, EXTRA_ROW_CLASS } from "../ExtraTableShell";
import { PERMISOS_GRID_COLUMNS } from "./PermisosTableHeader";

interface Props {
    permisoViaje: PermisoViaje
    readyOnly?: boolean
    index?: number
}

const Empty = () => <span className="text-slate-300">—</span>

const PermisoCard = ({ permisoViaje, readyOnly, index = 0 }: Props) => {
    const [open, setOpen] = useState(false);
    const openRow = () => {
        if (readyOnly) return
        setOpen(true)
    }
    const tipo = PERMISO_VIAJE_ASUNTOS.find(asunto => asunto.cod_asunto === permisoViaje.asunto)?.des_asunto

  return (
    <>
    <motion.div
        {...rowMotionProps(index)}
        role={readyOnly ? undefined : "button"}
        tabIndex={readyOnly ? undefined : 0}
        onClick={openRow}
        onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                openRow()
            }
        }}
        className={`${EXTRA_ROW_CLASS} ${readyOnly ? "" : "cursor-pointer"} ${
            permisoViaje.swt_est === "NC" ? "bg-amber-50/80 ring-1 ring-inset ring-amber-200" : ""
        }`}
        style={{ gridTemplateColumns: PERMISOS_GRID_COLUMNS }}
      >
        <div>
            <span className={EXTRA_ID_BADGE_CLASS}>{permisoViaje.num_formu || <Empty />}</span>
        </div>
        <p className="font-mono tabular-nums text-slate-800">{permisoViaje.num_kardex || <Empty />}</p>
        <div className="min-w-0 space-y-1">
            {permisoViaje.contratantes?.length ? permisoViaje.contratantes.map((contratante) => (
                <div key={contratante.id_contratante} className="leading-snug">
                    <span className="font-semibold text-slate-500">
                        {PERMISO_VIAJE_CONDICIONES.find(c => c.id_condicion === contratante.c_condicontrat)?.des_condicion}:
                    </span>{" "}
                    <span className="text-slate-800">{contratante.c_descontrat}</span>
                </div>
            )) : <Empty />}
        </div>
        <p className="tabular-nums text-slate-600">{permisoViaje.fecha_crono || <Empty />}</p>
        <p className="leading-snug text-slate-700">{tipo || <Empty />}</p>
        <p className="tabular-nums text-slate-600">{permisoViaje.fec_ingreso || <Empty />}</p>
        <p className="leading-snug text-slate-700">{getTitleCase(permisoViaje.lugar_formu || "") || <Empty />}</p>
      </motion.div>
      <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <UpdatePermiso 
            permisoViaje={permisoViaje}
        />
      </TopModal>
    </>
  )
}

export default PermisoCard
