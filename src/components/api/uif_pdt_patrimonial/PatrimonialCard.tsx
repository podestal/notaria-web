import { Patrimonial } from "../../../services/api/patrimonialService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    patrimonial: Patrimonial
    contrato: string
}

const PatrimonialCard = ({ patrimonial, contrato }: Props) => {

    const sanitizedContratto = contrato.replace('/', '')

  return (
    <div className='grid grid-cols-8 gap-4 text-black text-xs p-2 my-2'>
        <p>{patrimonial.itemmp}</p>
        <p>{patrimonial.kardex}</p>
        <p className='col-span-2'>{getTitleCase(sanitizedContratto)}</p>
        <p>{patrimonial.nminuta}</p>
        <p>{getTitleCase(patrimonial.moneda)}</p>
        <p>{patrimonial.importetrans}</p>
        <p>{getTitleCase(patrimonial.exhibiomp)}</p>
    </div>
  )
}

export default PatrimonialCard