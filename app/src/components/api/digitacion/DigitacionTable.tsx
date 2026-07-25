import { Kardex } from "../../../services/api/kardexService"
import DigitacionTableBody from "./DigitacionTableBody"
import DigitacionTableHeader from "./DigitacionTableHeader"

interface Props {
    kardex: Kardex
    setHasExistingDocument: React.Dispatch<React.SetStateAction<boolean>>
}


const DigitacionTable = ({ kardex, setHasExistingDocument }: Props) => {

    console.log(kardex);
    
  return (
    <>
        <DigitacionTableHeader />
        <DigitacionTableBody 
            kardex={kardex}
            setHasExistingDocument={setHasExistingDocument}
        />
    </>
  )
}

export default DigitacionTable
