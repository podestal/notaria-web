import { Cliente } from "../../../../services/api/cliente1Service"
import getTitleCase from "../../../../utils/getTitleCase"
import Paginator from "../../../ui/Paginator"

interface Props {
    clientes: Cliente[]
    count: number
    page: number
    setPage: React.Dispatch<React.SetStateAction<number>>
    refetch: () => void
}

const ClienteByNameTable = ({ clientes, count, page, setPage, refetch }: Props) => {

  return (
    <>
        {/* header */}
        <div className="w-full grid grid-cols-5 gap-4 bg-slate-100 text-black text-xs font-semibold p-2 mb-4">
            <p className="col-span-3">Nombre / Razon Social</p>
            <p>Documento</p>
            <p></p>
        </div>

        {/* body */}
        <>
        {clientes ? (
        <>
        <div className="">
            {clientes?.map(cliente => (
                <div key={cliente.idcliente} className="w-full grid grid-cols-5 gap-4 bg-white text-black text-xs p-2 mb-4 items-center hover:cursor-pointer hover:bg-slate-100">
                    <p className="col-span-3">{getTitleCase(cliente.nombre || cliente.razonsocial || '')}</p>
                    <p className="col-span-1">{cliente.numdoc}</p>
                    <button 
                    type="button"
                    className="bg-blue-600 w-24 text-white rounded-md py-2 text-center transition-colors duration-300 hover:cursor-pointer hover:bg-blue-500"
                    onClick={() => {
                        console.log('cliente', cliente)
                    }}
                    >Seleccionar</button>
                </div>
            ))}
        </div>
        <Paginator 
            page={page}
            setPage={setPage}
            itemsCount={count}
            refetch={refetch}
        />
        </>    
        ) : (
            <div className="text-center text-sm text-gray-500">No se encontraron clientes</div>
        )}
        </>
    </>
  )
}

export default ClienteByNameTable