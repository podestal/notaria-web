import { Pencil } from "lucide-react"
import { Contratante } from "../../../services/api/contratantesService"
import TopModal from "../../ui/TopModal"
import { useRef, useState } from "react"
import PreUpdateContratantesForm from "./PreUpdateContratantesForm"

interface Props {
    idtipoacto: string
    idtipkar: number
    kardex: string
    idkardex?: number
    contratante: Contratante
}

const UpdateContratante = ({ idtipoacto, idtipkar, kardex, idkardex, contratante }: Props) => {
    const [open, setOpen] = useState(false)
    const closeGuardRef = useRef<(() => boolean) | null>(null)

    const handleClose = () => {
        if (closeGuardRef.current && !closeGuardRef.current()) return
        setOpen(false)
    }

    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                title="Editar contratante"
                aria-label="Editar contratante"
                className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-sky-700 transition hover:bg-sky-100 hover:text-sky-800"
            >
                <Pencil className="h-3.5 w-3.5" aria-hidden />
            </button>
            <TopModal isOpen={open} onClose={handleClose}>
                <PreUpdateContratantesForm
                    idtipoacto={idtipoacto}
                    idtipkar={idtipkar}
                    kardex={kardex}
                    idkardex={idkardex}
                    contratante={contratante}
                    setCloseUpdateContratante={setOpen}
                    onRegisterCloseGuard={(guard) => {
                        closeGuardRef.current = guard
                    }}
                />
            </TopModal>
        </>
    )
}

export default UpdateContratante
