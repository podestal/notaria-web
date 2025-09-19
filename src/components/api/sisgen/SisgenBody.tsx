
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
    noDocsMessage: string
    setNoDocsMessage: Dispatch<SetStateAction<string>>
}

const SisgenBody = ({ typekardex, instrumentType, sisgenDocs, setSisgenDocs, itemsCount, setItemsCount, page, setPage, noDocsMessage, setNoDocsMessage }: Props) => {

    const [searchId, setSearchId] = useState('');
    const [selectedEstado, setSelectedEstado] = useState(-1);
    const [loading, setLoading] = useState(false)

    const [selectedFromDate, setSelectedFromDate] = useState<Date | undefined>(undefined);
    const [selectedToDate, setSelectedToDate] = useState<Date | undefined>(undefined);
    const [errorDisplay, setErrorDisplay] = useState('');

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
          loading={loading}
          setLoading={setLoading}
          setNoDocsMessage={setNoDocsMessage}
          selectedFromDate={selectedFromDate}
          setSelectedFromDate={setSelectedFromDate}
          selectedToDate={selectedToDate}
          setSelectedToDate={setSelectedToDate}
          setErrorDisplay={setErrorDisplay}
          errorDisplay={errorDisplay}
        />
        {loading ? <p className="text-center text-gray-700 my-8 animate-pulse text-xs ">Cargando...</p> : <>
        {instrumentType === 5 
        ? 
        <SisgenBooksTable sisgenDocs={sisgenDocs} noDocsMessage={noDocsMessage} /> 
        : 
        <SIsgenSearchTable 
          sisgenDocs={sisgenDocs} 
          noDocsMessage={noDocsMessage} 
          setPage={setPage} 
          instrumentType={instrumentType} 
          selectedFromDate={selectedFromDate} 
          selectedToDate={selectedToDate} 
          selectedEstado={selectedEstado} 
          page={page} 
          setSisgenDocs={setSisgenDocs}
          setItemsCount={setItemsCount}
          setSearchId={setSearchId} 
          setNoDocsMessage={setNoDocsMessage} 
          setErrorDisplay={setErrorDisplay} 
          searchId={searchId}
          setLoading={setLoading}
        />}
        {sisgenDocs && <Paginator page={page} setPage={setPage} itemsCount={itemsCount} />}
        </>}
    </div>
  )
}

export default SisgenBody