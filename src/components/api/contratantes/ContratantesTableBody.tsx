import { Kardex } from "../../../services/api/kardexService"
import getTitleCase from "../../../utils/getTitleCase"

interface Props {
    kardex: Kardex
}

const ContratantesTableBody = ({ kardex }: Props) => {
  return (
    <div className="grid grid-cols-8 text-xs text-black px-2">
        <p className="col-span-2">{getTitleCase(kardex.cliente)}</p>
    </div>
  )
}

export default ContratantesTableBody