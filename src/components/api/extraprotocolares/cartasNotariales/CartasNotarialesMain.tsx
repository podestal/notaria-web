import { useState } from 'react';
import GenericHeader from '../../../ui/GenericHeader'
import CartasNotarialesFilters from './CartasNotarialesFilters';
import useGetIngresoCartas from '../../../../hooks/api/extraprotocolares/ingresoCartas/useGetIngresoCartas';
import useAuthStore from '../../../../store/useAuthStore';
import CartasNotarialesTable from './CartasNotarialesTable';
import Paginator from '../../../ui/Paginator';

const CartasNotarialesMain = () => {

  const access = useAuthStore(s => s.access_token) || '';

  const [numCarta, setNumCarta] = useState('');
  const [remitente, setRemitente] = useState('');
  const [destinatario, setDestinatario] = useState('');
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined)
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined)
  const [dateType, setDateType] = useState('1') // Assuming you want to manage a date type
  const [page, setPage] = useState(1);

  const { data: ingresoCartas, isLoading, isError, error, isSuccess, refetch } = useGetIngresoCartas({ access, page, numCarta, remitente, destinatario, dateFrom, dateTo, dateType });

  if (isLoading) return <p className="text-center text-xs animate-pulse my-4">Cargando ...</p>;
  if (isError) return <p className="text-center text-xs text-red-500 my-4">Error: {error.message}</p>;

  if (isSuccess)

  return (
    <div className="mt-[80px] w-[85%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <GenericHeader 
          title="Cartas Notariales"
          setOpen={() => {}}
        />
        <CartasNotarialesFilters 
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          dateType={dateType}
          setDateType={setDateType}
          page={page}
          numCarta={numCarta}
          setNumCarta={setNumCarta}
          remitente={remitente}
          setRemitente={setRemitente}
          destinatario={destinatario}
          setDestinatario={setDestinatario}
          refetch={refetch}
        />
        <CartasNotarialesTable 
          ingresoCartas={ingresoCartas.results}
          page={page}
        />
        <Paginator
          page={page}
          setPage={setPage}
          itemsCount={ingresoCartas.count} 
        />
    </div>
  )
}

export default CartasNotarialesMain