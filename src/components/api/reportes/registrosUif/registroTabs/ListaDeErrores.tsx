import { useState } from "react"
import { KardexError } from "../../../../../services/api/kardexService"
import TopModal from "../../../../ui/TopModal"
import PreKardexForm from "../PreKardexForm"

interface Props {
    kardexErrors: KardexError[]
}

const ListaDeErrores = ({
    kardexErrors
}: Props) => {

  const [isOpen, setIsOpen] = useState(false)
  const [kardexId, setKardexId] = useState(0)

  return (
    <>
        <div className="grid grid-cols-8 gap-4 justify-center items-center text-center text-xs font-semibold p-2 my-4 mx-6">
            <p>Kardex</p>
            <p className="col-span-2">Acto</p>
            <p className="col-span-5">Descripción del Error</p>
        </div>
        {kardexErrors.map((error, idx) => (
            <div key={`${error.kardex}-${idx}`}>
                <div className="grid grid-cols-8 gap-4 justify-center items-center text-center bg-slate-100 text-black text-xs p-2 my-4 mx-6">
                    <p 
                        onClick={() => {
                            setIsOpen(true)
                            setKardexId(error.idkardex)
                        }}
                        className="text-blue-700 hover:text-blue-400 cursor-pointer transition-all duration-300">{error.kardex}</p>
                    <p className="col-span-2 text-left">{error.act}</p>
                    <p className="col-span-5 text-left">{error.error_description}</p>
                </div>
            </div>

            
        ))}
        <TopModal
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
        >
            <PreKardexForm
                isOpen={isOpen}
                kardexId={kardexId}
            />
        </TopModal>
    </>
  )
}

export default ListaDeErrores