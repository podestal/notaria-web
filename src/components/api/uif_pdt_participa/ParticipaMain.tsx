import { Kardex } from "../../../services/api/kardexService"
import ParticipaGenerate from "./ParticipaGenerate"
import ParticipaTable from "./ParticipaTable"

interface Props {
    kardex: Kardex
}

const ParticipaMain = ({ kardex }: Props) => {
  return (
    <div className="my-6">
        <>{console.log('UIF/PDT Participa kardex', kardex)}</>
        <ParticipaTable />
        <ParticipaGenerate />
    </div>
  )
}

export default ParticipaMain