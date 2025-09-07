
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
    itemsCount: number
    setItemsCount: Dispatch<SetStateAction<number>>
    page: number
    setPage: Dispatch<SetStateAction<number>>
}

const SisgenBody = ({ typekardex, instrumentType, sisgenDocs, setSisgenDocs, itemsCount, setItemsCount, page, setPage }: Props) => {



    const [searchId, setSearchId] = useState('');
    const [selectedEstado, setSelectedEstado] = useState(-1);

  return (
    <div className="w-full my-6">
        <h2 className="text-xl font-bold">{typekardex}</h2>
        {itemsCount > 0 && <p className="text-sm my-4 text-gray-700">Total de documentos encontrados: {itemsCount}</p>}
        <SisgenSearchForm 
          instrumentType={instrumentType}
          setSisgenDocs={setSisgenDocs}
          page={page}
          setItemsCount={setItemsCount}
          searchId={searchId}
          setSearchId={setSearchId}
          selectedEstado={selectedEstado}
          setSelectedEstado={setSelectedEstado}
        />
        {instrumentType === 5 ? <SisgenBooksTable sisgenDocs={sisgenDocs} /> : <SIsgenSearchTable sisgenDocs={sisgenDocs} />}
        {sisgenDocs && <Paginator page={page} setPage={setPage} itemsCount={itemsCount} />}
    </div>
  )
}

export default SisgenBody