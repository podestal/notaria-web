import { useEffect, useState } from "react"
import PlantillaFilter from "./PlantillaFilter"
import PantillaList from "./PantillaList"

const PlantillasMain = () => {

  const [codeActs, setCodeActs] = useState('')
  const [fkType, setFkType] = useState('')
  const [nameTemplate, setNameTemplate] = useState('')
  const [page, setPage] = useState(1)

  useEffect(() => {
    setPage(1)
  }, [codeActs, fkType, nameTemplate])

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <PlantillaFilter
        codeActs={codeActs}
        fkType={fkType}
        nameTemplate={nameTemplate}
        setCodeActs={setCodeActs}
        setFkType={setFkType}
        setNameTemplate={setNameTemplate}
      />
      <PantillaList
        codeActs={codeActs}
        fkType={fkType}
        nameTemplate={nameTemplate}
        page={page}
        setPage={setPage}
      />
        {/* <CreatePlantilla />
         */}
    </div>
  )
}

export default PlantillasMain