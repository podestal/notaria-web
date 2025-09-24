import { AnimatePresence, motion } from "framer-motion"
import { TipoActo } from "../../../services/api/tipoActosService"
import { useEffect, useState } from "react"

interface Props {
    tipoActos: TipoActo[]
    contratos: string[]
    setContratosDes: React.Dispatch<React.SetStateAction<string[]>>
    setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>
}

const KardexActosSelector = ({ tipoActos, contratos, setContratosDes, setSelectedIds }: Props) => {
    
    const [actos, setActos] = useState<TipoActo[]>(tipoActos.filter(acto => contratos.includes(acto.idtipoacto)))

    useEffect(() => {
        setActos(tipoActos.filter(acto => contratos.includes(acto.idtipoacto)))
        setContratosDes(tipoActos.filter(acto => contratos.includes(acto.idtipoacto)).map(acto => acto.desacto))
    }, [contratos])

  return (
    <AnimatePresence>
        {actos
            .map( acto => (
                <motion.div
                    layout
                    exit={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: -10 }}
                    className="w-full flex justify-between items-center gap-4"
                >
                    <motion.div
  
                        onClick={() => setSelectedIds(prev => prev.includes(acto.idtipoacto) ? prev.filter(id => id !== acto.idtipoacto) : [...prev, acto.idtipoacto])}
                        className="flex-1 text-xs text-white px-2 my-2 place-content-center bg-blue-600 rounded-md hover:bg-blue-500 py-1 w-auto grid grid-cols-8 gap-2"
                        key={acto.idtipoacto}>
                        <p className="col-span-6">{acto.desacto}</p>
                        <p>Sunat: {acto.actosunat}</p>
                        <p>UIF: {acto.actouif}</p>
                    </motion.div>
                    <button
                    type="button"
                    onClick={() => setSelectedIds(prev => prev.filter(id => id !== acto.idtipoacto))}
                    className="cursor-pointer text-xs text-white px-2 my-2 place-content-center bg-red-600 rounded-md hover:bg-red-500 py-1 w-auto"
                    >X</button>
                </motion.div>

            ))
        }
    </AnimatePresence>
  )
}

export default KardexActosSelector