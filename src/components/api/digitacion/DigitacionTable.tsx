import { Kardex } from "../../../services/api/kardexService"
import DigitacionTableBody from "./DigitacionTableBody"
import DigitacionTableHeader from "./DigitacionTableHeader"

interface Props {
    kardex: Kardex
}


const DigitacionTable = ({ kardex }: Props) => {

    console.log(kardex);
    
  return (
    <>
        <DigitacionTableHeader />
        <DigitacionTableBody 
            kardex={kardex}
        />
    </>
  )
}

export default DigitacionTable