import { useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"
import KardexForm from "./KardexForm"
import TopModal from "../../ui/TopModal"
import useUpdateKardex from "../../../hooks/api/kardex/useUpdateKardex"

interface Props {
    kardex: Kardex
}

const KardexCard = ({ kardex }: Props) => {

    const [open, setOpen] = useState(false)
    const updateKardex = useUpdateKardex({ kardexId: kardex.idkardex })

  return (
    <>
    <div 
        key={kardex.idkardex}
        className="grid grid-cols-13 text-[10px] text-center my-4 gap-2"
    >
        <h2 
            onClick={() => setOpen(true)}
            className="text-blue-600 hover:text-blue-400 cursor-pointer">{kardex.kardex}</h2>
        <p>{kardex.fechaingreso}</p>
        <p>{kardex.contrato}</p>
        <p>{getTitleCase(kardex.cliente)}</p>
        <p>{kardex.fechaescritura}</p>
        <p>{kardex.numescritura}</p>
        <p>{kardex.numminuta}</p>
        <p>{kardex.folioini}</p>
        <p>{kardex.foliofin}</p>
        <p>{kardex.numinstrmento}</p>
        <p>{kardex.txa_minuta}</p>
        <p>{getTitleCase(kardex.usuario)}</p>
        <p>Escaneo ...</p>
    </div>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <KardexForm 
            updateKardex={updateKardex}
            kardex={kardex} />
    </TopModal>
    </>
  )
}

export default KardexCard