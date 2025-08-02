import { useState } from 'react';
import GenericHeader from '../../../ui/GenericHeader'
import TopModal from '../../../ui/TopModal';
import LibrosFilters from './LibrosFilters';
import LibrosTable from './LibrosTable';

const AperturaDeLibrosMain = () => {

  const [open, setOpen] = useState(false);
  const [cliente, setCliente] = useState('');
  const [numDoc, setNumDoc] = useState('');
  const [cronologico, setCronologico] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [page, setPage] = useState(1);

  return (
    <>
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Apertura de Libros"
          setOpen={setOpen}
        />
        <LibrosFilters
          cliente={cliente}
          numDoc={numDoc}
          cronologico={cronologico}
          dateFrom={dateFrom}
          dateTo={dateTo}
          setCliente={setCliente}
          setNumDoc={setNumDoc}
          setCronologico={setCronologico}
          setDateFrom={setDateFrom}
          setDateTo={setDateTo} 
        />
        <LibrosTable />
        
    </div>
    <TopModal
      isOpen={open}
      onClose={() => setOpen(false)}
    >
      <p>Contenido del modal de Apertura de Libros</p>  
    </TopModal>
    </>
  )
}

export default AperturaDeLibrosMain