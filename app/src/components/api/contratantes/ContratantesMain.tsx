import { Kardex } from "../../../services/api/kardexService"
import ContratantesTable from "./ContratantesTable"

interface Props {
    kardex: Kardex
}

const ContratantesMain = ({ kardex }: Props) => (
    <ContratantesTable kardex={kardex} />
)

export default ContratantesMain
