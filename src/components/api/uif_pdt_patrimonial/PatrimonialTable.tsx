import { Kardex } from "../../../services/api/kardexService"
import PatrimonialTableBody from "./PatrimonialTableBody"
import PatrimonialTableHeader from "./PatrimonialTableHeader"

interface Props {
    kardex: Kardex
}

const PatrimonialTable = ({ kardex }: Props) => {

  return (
    <>
        <PatrimonialTableHeader />
        <PatrimonialTableBody 
            kardex={kardex}
        />
    </>
  )
}

export default PatrimonialTable