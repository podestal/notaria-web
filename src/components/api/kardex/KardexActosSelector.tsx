import { AnimatePresence, motion } from "framer-motion"
import { TipoActo } from "../../../services/api/tipoActosService"
import { useEffect, useState } from "react"

interface Props {
    tipoActos: TipoActo[]
    contratos: string[]
    setContratosDes: React.Dispatch<React.SetStateAction<string[]>>
}

const KardexActosSelector = ({ tipoActos, contratos, setContratosDes }: Props) => {

    console.log('contratos', contratos);
    

    const [actos, setActos] = useState<TipoActo[]>(tipoActos.filter(acto => contratos.includes(acto.idtipoacto)))

    useEffect(() => {
        setActos(tipoActos.filter(acto => contratos.includes(acto.idtipoacto)))
        setContratosDes(tipoActos.filter(acto => contratos.includes(acto.idtipoacto)).map(acto => acto.desacto))
    }, [contratos])

  return (
    <AnimatePresence>
        <>{console.log('actos', actos)}</>
        {actos
            .map( acto => (
                <motion.div
                    layout
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-xs text-white px-2 my-2 place-content-center bg-blue-600 rounded-md hover:bg-blue-500 py-1 w-auto"
                    key={acto.idtipoacto}>
                    {acto.desacto}
                </motion.div>
            ))
        }
    </AnimatePresence>
  )
}

export default KardexActosSelector