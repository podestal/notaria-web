import { SquareX } from "lucide-react"


const RemoveDetalleMediosDePago = () => {
  return (
    <>
        <button
            // onClick={() => setOpen(true)}
        >
            <SquareX 
                size={20}
                className="text-red-500 hover:text-red-400 cursor-pointer"
            />
        </button>
    </>
  )
}

export default RemoveDetalleMediosDePago