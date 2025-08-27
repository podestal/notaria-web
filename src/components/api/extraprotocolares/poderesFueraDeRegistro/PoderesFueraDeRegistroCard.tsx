import { useState } from "react"
import { TIPO_PODERES } from "../../../../data/poderesFueraDeRegistro"
import { IngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import TopModal from "../../../ui/TopModal"
import UpdatePoderesFueraDeRegistro from "./UpdatePoderesFueraDeRegistro"

interface Props {
    poder: IngresoPoderes
    page: number
    readyOnly?: boolean
}

const PoderesFueraDeRegistroCard = ({ poder, page, readyOnly }: Props) => {

    const [open, setOpen] = useState(false);

  return (
    <>
        <div className="grid grid-cols-8 gap-4 justify-center items-center text-center text-black text-xs p-2 my-4 mx-6">
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
        </div>
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