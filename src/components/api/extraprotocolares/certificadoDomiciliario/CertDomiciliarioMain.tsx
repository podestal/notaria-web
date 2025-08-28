import { useCallback, useState } from 'react';
import GenericHeader from '../../../ui/GenericHeader'
import DomiciliarioFilters from './DomiciliarioFilters';
import useGetDomiciliarios from '../../../../hooks/api/extraprotocolares/domiciliario/useGetDomiciliarios';
import useAuthStore from '../../../../store/useAuthStore';
import Paginator from '../../../ui/Paginator';
import DomiciliarioTable from './DomiciliarioTable';
import TopModal from '../../../ui/TopModal';
import CreateDomiciliario from './CreateDomiciliario';

const CertDomiciliarioMain = () => {

  const [open, setOpen] = useState(false);
  const access = useAuthStore(s => s.access_token) || '';
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [crono, setCrono] = useState<string>('');
  const [solicitante, setSolicitante] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data: domiciliarioPage, isLoading, isError, error, isSuccess, refetch } = useGetDomiciliarios({ access, page, dateFrom, dateTo, crono, solicitante });

  const handleReset = useCallback(() => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setCrono('');
    setSolicitante('');
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
            title="Certificado Domiciliario"
            setOpen={setOpen}
            handleReset={handleReset}
          />
          <DomiciliarioFilters
              dateFrom={dateFrom}
              setDateFrom={setDateFrom}
              dateTo={dateTo}
              setDateTo={setDateTo}
              crono={crono}
              setCrono={setCrono}
              solicitante={solicitante}
              setSolicitante={setSolicitante}
              refetch={refetch}
          />
          <DomiciliarioTable 
              domiciliarios={domiciliarioPage.results}
              page={page}
          />

          <Paginator
            page={page}
            setPage={setPage}
            itemsCount={domiciliarioPage.count} 
          />
      </div>
      <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <CreateDomiciliario />
      </TopModal>
    </>
  )
}

export default CertDomiciliarioMain