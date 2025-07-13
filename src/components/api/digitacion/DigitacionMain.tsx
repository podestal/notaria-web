import { useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import DigitacionMutations from "./DigitacionMutations"
import DigitacionTable from "./DigitacionTable"

interface Props {
    kardex: Kardex
}

const DigitacionMain = ({ kardex }: Props) => {

  const [enableCreate, setEnableCreate] = useState(false)

  return (
    <div>
        <DigitacionMutations 
            kardex={kardex}
            enableCreate={enableCreate}
        />
        <DigitacionTable 
            kardex={kardex}
            setEnableCreate={setEnableCreate}
        />
    </div>
  )
}

export default DigitacionMain