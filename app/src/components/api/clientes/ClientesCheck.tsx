import { useState } from "react"
import { motion } from "framer-motion"
import TopModal from "../../ui/TopModal"
import { UserPlus } from "lucide-react"
import PreClientForm from "./PreClientForm"
import ExplanationMessage from "../../ui/ExplanationMessage"

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    /** Compact toolbar button for the contratantes table header. */
    compact?: boolean
}

const ClientesCheck = ({ idtipkar, idtipoacto, kardex, compact = false }: Props) => {
    const [open, setOpen] = useState(false)
    const [openWarning, setOpenWarning] = useState(false)

    return (
        <>
            {compact ? (
                <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOpen(true)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-800 shadow-sm transition hover:bg-emerald-100"
                >
                    <UserPlus className="h-3.5 w-3.5" aria-hidden />
                    Agregar contratante
                </motion.button>
            ) : (
                <motion.button
                    type="button"
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setOpen(true)}
                    className="mt-4 flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded-lg bg-white shadow-md transition-colors hover:bg-gray-100"
                >
                    <UserPlus className="mb-2 h-6 w-6 text-green-500 hover:text-green-700" />
                    <p className="text-center text-[10px] text-gray-700">Agregar Contratante</p>
                </motion.button>
            )}
            <div className="z-50">
                <TopModal
                    isOpen={open}
                    onClose={() => {
                        setOpenWarning(true)
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
                            setOpen(false)
                        }}
                        onClickSecondaryMessage="Aceptar"
                    />
                </TopModal>
            </div>
        </>
    )
}

export default ClientesCheck
