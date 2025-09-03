
import { useState } from "react";
import SisgenSearchForm from "./SisgenSearchForm";
import SIsgenSearchTable from "./SIsgenSearchTable";
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";
import Paginator from "../../ui/Paginator";

interface Props {
    typekardex: string;
    instrumentType: number
}

const SisgenBody = ({ typekardex, instrumentType }: Props) => {

    const [sisgenDocs, setSisgenDocs] = useState<SISGENDocument[]>([]);
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
        <SIsgenSearchTable sisgenDocs={sisgenDocs} />
        {sisgenDocs && <Paginator page={page} setPage={setPage} itemsCount={itemsCount} />}
    </div>
  )
}

export default SisgenBody