import { useCallback, useEffect, useState } from 'react';
import GenericHeader from '../../../ui/GenericHeader'
import TopModal from '../../../ui/TopModal';
import LibrosFilters from './LibrosFilters';
import LibrosTable from './LibrosTable';
import useGetLibros from '../../../../hooks/api/extraprotocolares/aperturaLibros/useGetLibros';
import useAuthStore from '../../../../store/useAuthStore';
import Paginator from '../../../ui/Paginator';
import CreateLibro from './CreateLibro';


const AperturaDeLibrosMain = () => {

  const access = useAuthStore(s => s.access_token) || '';

  const [open, setOpen] = useState(false);
  const [cliente, setCliente] = useState('');
  const [numDoc, setNumDoc] = useState('');
  const [cronologico, setCronologico] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [page, setPage] = useState(1);

  const { data: librosData, isLoading, isError, error, isSuccess, refetch } = useGetLibros({access, page, cliente, numDoc, cronologico, dateFrom, dateTo });

  const handleReset = useCallback(() => {
    setCliente('');
    setNumDoc('');
    setCronologico('');
    setDateFrom(undefined);
    setDateTo(undefined);
    setPage(1);
    
    requestAnimationFrame(() => {
      refetch();
    });
  }, [refetch]);


  if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>;
  if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>;

  if (isSuccess)

  return (
    <>
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Apertura de Libros"
          setOpen={setOpen}
          handleReset={handleReset}
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
          refetch={refetch}
        />
        <LibrosTable 
          libros={librosData.results}
          page={page}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={librosData.count}
        />
        
    </div>
    <TopModal
      isOpen={open}
      onClose={() => setOpen(false)}
    >
      <CreateLibro />
    </TopModal>
    </>
  )
}

export default AperturaDeLibrosMain