import { motion } from "framer-motion"
import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroCard from "./PoderesFueraDeRegistroCard"
import { emptyMotionProps } from "../rowMotion"

interface Props {
    poderes: IngresoPoderesPage | undefined
    page: number
    readyOnly?: boolean
}


const PoderesFueraDeRegistroTableBody = ({ poderes, page, readyOnly }: Props) => {

  return (
    <>
        {poderes && poderes.results.length > 0 ?
        <>
            {poderes.results.map((poder, index) => (
                <PoderesFueraDeRegistroCard 
                  key={poder.id_poder} poder={poder} page={page} readyOnly={readyOnly} index={index} />
            ))}
        </>
        :
        <motion.p {...emptyMotionProps} className="col-span-8 text-center my-4 text-xs text-slate-500">No hay registros</motion.p>
        }
    </>
  )
}

export default PoderesFueraDeRegistroTableBody