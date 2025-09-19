import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSearchTableBody from "./SisgenSearchTableBody"
import SisgenSearchTableHeader from "./SisgenSearchTableHeader"

interface Props {
    sisgenDocs: SISGENDocument[]
    noDocsMessage: string
    setPage: React.Dispatch<React.SetStateAction<number>>
    instrumentType: number
    selectedFromDate: Date | undefined
    selectedToDate: Date | undefined
    selectedEstado: number
    page: number
    setSisgenDocs: React.Dispatch<React.SetStateAction<SISGENDocument[]>>
    setItemsCount: React.Dispatch<React.SetStateAction<number>>
    setSearchId: React.Dispatch<React.SetStateAction<string>>
    setNoDocsMessage: React.Dispatch<React.SetStateAction<string>>
    setErrorDisplay: React.Dispatch<React.SetStateAction<string>>
    searchId: string
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

const SIsgenSearchTable = ({ 
  sisgenDocs, 
  noDocsMessage, 
  setPage, 
  instrumentType, 
  selectedFromDate, 
  selectedToDate, 
  selectedEstado,
  page,
  setSisgenDocs, 
  setItemsCount, 
  setSearchId, 
  setNoDocsMessage, 
  setErrorDisplay,
  searchId,
  setLoading
 }: Props) => {
  
  return (
    <>
    {sisgenDocs.length > 0 ? 
    <>
        <SisgenSearchTableHeader 
          setPage={setPage} 
          sisgenDocs={sisgenDocs} 
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
        />
        <SisgenSearchTableBody 
          sisgenDocs={sisgenDocs} 
        />
    </>
    :
    <div className="text-center text-gray-500 p-4">{noDocsMessage}</div>}
    </>
  )
}

export default SIsgenSearchTable