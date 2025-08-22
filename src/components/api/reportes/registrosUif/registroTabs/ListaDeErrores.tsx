import { KardexROError } from "../../../../../services/api/kardexService"

interface Props {
    kardexErrors: KardexROError[]
}

const ListaDeErrores = ({
    kardexErrors
}: Props) => {

  return (
    <>
        <div className="grid grid-cols-8 gap-4 justify-center items-center text-center bg-slate-200 text-black text-xs font-semibold p-2 my-4 mx-6">
            <p>Kardex</p>
            <p className="col-span-2">Acto</p>
            <p className="col-span-5">Descripción del Error</p>
        </div>
        {kardexErrors.map((error) => (
            <div key={error.idkardex} className="grid grid-cols-8 gap-4 justify-center items-center text-center bg-slate-100 text-black text-xs p-2 my-4 mx-6">
                <p className="text-blue-700 hover:text-blue-400 cursor-pointer transition-all duration-300">{error.kardex}</p>
                <p className="col-span-2">{error.act}</p>
                <p className="col-span-5">{error.error_description}</p>
            </div>
        ))}
    </>
  )
}

export default ListaDeErrores