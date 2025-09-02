import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSearchTableBody from "./SisgenSearchTableBody"
import SisgenSearchTableHeader from "./SisgenSearchTableHeader"

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SIsgenSearchTable = ({ sisgenDocs }: Props) => {
  return (
    <div>
        <h2 className="my-2 font-semibold">Errores encontrados (Estos kardex no son enviados)</h2>
        <SisgenSearchTableHeader />
        <SisgenSearchTableBody sisgenDocs={sisgenDocs} />
    </div>
  )
}

export default SIsgenSearchTable