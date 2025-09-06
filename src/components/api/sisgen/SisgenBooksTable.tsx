import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenBooksTableBody from "./SisgenBooksTableBody";
import SisgenBooksTableHeader from "./SisgenBooksTableHeader";

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SisgenBooksTable = ({ sisgenDocs }: Props) => {

    return (
        <div>
            <SisgenBooksTableHeader />
            <SisgenBooksTableBody sisgenDocs={sisgenDocs} />
        </div>
      )
}

export default SisgenBooksTable