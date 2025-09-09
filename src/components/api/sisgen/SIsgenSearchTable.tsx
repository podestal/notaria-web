import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSearchTableBody from "./SisgenSearchTableBody"
import SisgenSearchTableHeader from "./SisgenSearchTableHeader"

interface Props {
    sisgenDocs: SISGENDocument[]
    noDocsMessage: string
}

const SIsgenSearchTable = ({ sisgenDocs, noDocsMessage }: Props) => {
  return (
    <div>
        {/* <h2 className="my-2 font-semibold">Errores encontrados (Estos kardex no son enviados)</h2> */}
        <SisgenSearchTableHeader />
        <SisgenSearchTableBody sisgenDocs={sisgenDocs} noDocsMessage={noDocsMessage} />
    </div>
  )
}

export default SIsgenSearchTable