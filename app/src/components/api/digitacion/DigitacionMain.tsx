import { useState } from "react"
import { Kardex } from "../../../services/api/kardexService"
import DigitacionMutations from "./DigitacionMutations"
import DigitacionTable from "./DigitacionTable"

interface Props {
    kardex: Kardex
}

const DigitacionMain = ({ kardex }: Props) => {

  const [hasExistingDocument, setHasExistingDocument] = useState(false)

  return (
    <div>
        <DigitacionMutations 
            kardex={kardex}
            hasExistingDocument={hasExistingDocument}
        />
        <DigitacionTable 
            kardex={kardex}
            setHasExistingDocument={setHasExistingDocument}
        />
    </div>
  )
}

export default DigitacionMain
