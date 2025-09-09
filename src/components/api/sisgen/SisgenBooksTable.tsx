import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenBooksTableBody from "./SisgenBooksTableBody";
import SisgenBooksTableHeader from "./SisgenBooksTableHeader";

interface Props {
    sisgenDocs: SISGENDocument[]
    noDocsMessage: string
}

const SisgenBooksTable = ({ sisgenDocs, noDocsMessage }: Props) => {

    return (
        <div>
            <SisgenBooksTableHeader />
            <SisgenBooksTableBody sisgenDocs={sisgenDocs} noDocsMessage={noDocsMessage} />
        </div>
      )
}

export default SisgenBooksTable