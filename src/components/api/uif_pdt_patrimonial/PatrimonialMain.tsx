import { Kardex } from "../../../services/api/kardexService"
import CreatePatrimonial from "./CreatePatrimonial"
import PatrimonialTable from "./PatrimonialTable"

interface Props {
    kardex: Kardex
}

const PatrimonialMain = ({ kardex }: Props) => {
  return (
    <div>
        <CreatePatrimonial 
            kardex={kardex}
        />
        <PatrimonialTable 
            kardex={kardex}
        />
    </div>
  )
}

export default PatrimonialMain