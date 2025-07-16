import { useState } from "react"
import TopModal from "../../ui/TopModal"
import { UserPlus } from "lucide-react"
import PreClientForm from "./PreClientForm"
import ExplanationMessage from "../../ui/ExplanationMessage"

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
}

const ClientesCheck = ({ idtipkar, idtipoacto, kardex }: Props) => {

    const [open, setOpen] = useState(false)
    const [openWarning, setOpenWarning] = useState(false)

  return (
    <>
        <div 
            onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors">
            <UserPlus className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mb-2" />
            <p className="text-[10px] text-center text-gray-700">Agregar Contratante</p>
        </div>
        <div className="z-50">
            <TopModal
                isOpen={open}
                onClose={() => {
                    setOpenWarning(true);
            }}
            >
                <PreClientForm 
                    idtipoacto={idtipoacto}
                    idtipkar={idtipkar}
                    kardex={kardex}
                    setClientesCheck={setOpen}
                />
            </TopModal>
            <TopModal
                isOpen={openWarning}
                onClose={() => {
                    setOpenWarning(false)
                }}
            >
                <ExplanationMessage 
                    message="¿Está seguro de que desea cerrar el formulario?"
                    onClick={() => setOpenWarning(false)}
                    onClickMessage="Cancelar"
                    onClickSecondary={() => {
                        setOpenWarning(false)
                        setOpen(false)}}
                    onClickSecondaryMessage="Aceptar"
                />
            </TopModal>
        </div>
    </>
  )
}

export default ClientesCheck