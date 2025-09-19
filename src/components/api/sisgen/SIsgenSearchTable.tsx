import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSearchTableBody from "./SisgenSearchTableBody"
import SisgenSearchTableHeader from "./SisgenSearchTableHeader"

interface Props {
    sisgenDocs: SISGENDocument[]
    noDocsMessage: string
    setPage: React.Dispatch<React.SetStateAction<number>>
}

const SIsgenSearchTable = ({ sisgenDocs, noDocsMessage, setPage }: Props) => {
  return (
    <>
    {sisgenDocs.length > 0 ? 
    <>
        <SisgenSearchTableHeader setPage={setPage} />
        <SisgenSearchTableBody sisgenDocs={sisgenDocs} />
    </>
    :
    <div className="text-center text-gray-500 p-4">{noDocsMessage}</div>}
    </>
  )
}

export default SIsgenSearchTable