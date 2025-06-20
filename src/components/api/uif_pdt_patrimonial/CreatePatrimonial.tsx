import { Newspaper } from "lucide-react"
import { useState } from "react"
import TopModal from "../../ui/TopModal"
import PatrimonialForm from "./PatrimonialForm"

const CreatePatrimonial = () => {

    const [open, setOpen] = useState(false)

  return (
    <>
        <button
            className="gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer flex flex-col my-4 justify-center items-center"
            type="button"
            onClick={() => setOpen(true)}
        >
            <Newspaper />
            <p className="text-xs">Nuevo</p>
        </button>
        <TopModal
            isOpen={open}
            onClose={() => setOpen(false)}
        >
            <PatrimonialForm />
        </TopModal>
    </>
  )
}

export default CreatePatrimonial