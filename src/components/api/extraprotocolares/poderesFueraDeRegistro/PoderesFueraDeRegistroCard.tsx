import { TIPO_PODERES } from "../../../../data/poderesFueraDeRegistro"
import { IngresoPoderes } from "../../../../services/api/extraprotocolares/ingresoPoderes"

interface Props {
    poder: IngresoPoderes
}

const PoderesFueraDeRegistroCard = ({ poder }: Props) => {
  return (
    <div className="grid grid-cols-8 gap-4 justify-center items-center text-center text-black text-xs p-2 my-4 mx-6">
        <p
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
  )
}

export default PoderesFueraDeRegistroCard