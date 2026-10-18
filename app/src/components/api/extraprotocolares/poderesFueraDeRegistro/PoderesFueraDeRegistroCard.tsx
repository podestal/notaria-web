import { useState } from "react"
import { motion } from "framer-motion"
import { TIPO_PODERES } from "../../../../data/poderesFueraDeRegistro"
import { IngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import TopModal from "../../../ui/TopModal"
import UpdatePoderesFueraDeRegistro from "./UpdatePoderesFueraDeRegistro"
import { rowMotionProps } from "../rowMotion"

interface Props {
    poder: IngresoPoderes
    page: number
    readyOnly?: boolean
    index?: number
}

const PoderesFueraDeRegistroCard = ({ poder, page, readyOnly, index = 0 }: Props) => {

    const [open, setOpen] = useState(false);

  return (
    <>
        <motion.div
            {...rowMotionProps(index)}
            className={`grid grid-cols-8 gap-4 justify-center items-center text-center text-slate-800 text-xs p-2 my-4 mx-6 transition-colors hover:bg-sky-50/60 ${poder.swt_est === 'NC' ? 'bg-amber-500/10 border-amber-500 border-1 rounded-2xl' : ''}`}
        >
            <p
                onClick={() => {
                    if (readyOnly) return;
                    setOpen(true)
                }}
                className="text-center text-blue-600 cursor-pointer hover:text-blue-500"
            >{poder.id_poder}</p>
            <p>{poder.num_kardex}</p>
            <p className="col-span-2">{TIPO_PODERES.find(p => p.id_asunto === poder.id_asunto)?.des_asunto}</p>
            <p>{poder.fec_crono}</p>
            <div className="col-span-2 text-center">
                {poder.contratantes.map((contratante) => (
                    <div 
                        className="w-full gap-10 items-start justify-start text-left"
                        key={contratante.id_contrata}>
                        <p>{contratante.c_descontrat}</p>
                    </div>
                ))}
            </div>
            <p>{poder.fec_ingreso}</p>
        </motion.div>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <UpdatePoderesFueraDeRegistro 
                poder={poder} 
                page={page} 
            />
        </TopModal>
    </>
  )
}

export default PoderesFueraDeRegistroCard