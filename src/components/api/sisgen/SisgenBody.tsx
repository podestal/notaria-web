
import { Dispatch, SetStateAction, useState } from "react";
import SisgenSearchForm from "./SisgenSearchForm";
import SIsgenSearchTable from "./SIsgenSearchTable";
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";
import Paginator from "../../ui/Paginator";
import SisgenBooksTable from "./SisgenBooksTable";

interface Props {
    typekardex: string;
    instrumentType: number
    sisgenDocs: SISGENDocument[]
    setSisgenDocs: Dispatch<SetStateAction<SISGENDocument[]>>
}

const SisgenBody = ({ typekardex, instrumentType, sisgenDocs, setSisgenDocs }: Props) => {

    const [page, setPage] = useState(1);
    const [itemsCount, setItemsCount] = useState(0);
    const [searchId, setSearchId] = useState('');

  return (
    <div className="w-full my-6">
        <h2 className="text-xl font-bold">{typekardex}</h2>
        <SisgenSearchForm 
          instrumentType={instrumentType}
          setSisgenDocs={setSisgenDocs}
          page={page}
          setItemsCount={setItemsCount}
          searchId={searchId}
          setSearchId={setSearchId}
        />
        {instrumentType === 5 ? <SisgenBooksTable sisgenDocs={sisgenDocs} /> : <SIsgenSearchTable sisgenDocs={sisgenDocs} />}
        {sisgenDocs && <Paginator page={page} setPage={setPage} itemsCount={itemsCount} />}
    </div>
  )
}

export default SisgenBody