import { useState } from "react"
import SellosTable from "./SellosTable"
import SellosFilter from "./SellosFilter"

const SellosMain = () => {

    const [description, setDescription] = useState('')
  return (
    <div className="flex flex-col gap-4 w-full py-6 px-4">
        <SellosFilter
            description={description}
            setDescription={setDescription}
        />
        <SellosTable
            description={description}
        />
    </div>
  )
}

export default SellosMain