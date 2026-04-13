import { Kardex } from "../../../services/api/kardexService"
import DigitacionTableBody from "./DigitacionTableBody"
import DigitacionTableHeader from "./DigitacionTableHeader"

interface Props {
    kardex: Kardex
    setEnableCreate: React.Dispatch<React.SetStateAction<boolean>>
}


const DigitacionTable = ({ kardex, setEnableCreate }: Props) => {

    console.log(kardex);
    
  return (
    <>
        <DigitacionTableHeader />
        <DigitacionTableBody 
            kardex={kardex}
            setEnableCreate={setEnableCreate}
        />
    </>
  )
}

export default DigitacionTable