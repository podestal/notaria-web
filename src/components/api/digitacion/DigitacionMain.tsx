import { Kardex } from "../../../services/api/kardexService"
import DigitacionMutations from "./DigitacionMutations"
import DigitacionTable from "./DigitacionTable"

interface Props {
    kardex: Kardex
}

const DigitacionMain = ({ kardex }: Props) => {

  return (
    <div>
        <DigitacionMutations 
            kardex={kardex}
        />
        <DigitacionTable 
            kardex={kardex}
        />
    </div>
  )
}

export default DigitacionMain