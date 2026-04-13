import { useState } from "react"
import SellosTable from "./SellosTable"
import SellosFilter from "./SellosFilter"

interface Props {
    setContenido: React.Dispatch<React.SetStateAction<string>>
    setOpenSellos: React.Dispatch<React.SetStateAction<boolean>>
}

const SellosMain = ({
    setContenido,
    setOpenSellos,
}: Props) => {

    const [description, setDescription] = useState('')
  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4">
        <SellosFilter
            description={description}
            setDescription={setDescription}
        />
        <SellosTable
            description={description}
            setContenido={setContenido}
            setOpenSellos={setOpenSellos}
        />
    </div>
  )
}

export default SellosMain