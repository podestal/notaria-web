import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import TopModal from "../../ui/TopModal"
import PlantillaFilter, { type PlantillasTabVariant } from "./PlantillaFilter"
import PantillaList from "./PantillaList"
import CreatePlantilla from "./CreatePlantilla"

const PlantillasMain = () => {
  const [tab, setTab] = useState<PlantillasTabVariant>("protocolares")
  const [codeActs, setCodeActs] = useState("")
  const [fkType, setFkType] = useState("")
  const [nameTemplate, setNameTemplate] = useState("")
  const [page, setPage] = useState(1)
  const [createOpen, setCreateOpen] = useState(false)

  const switchTab = (next: PlantillasTabVariant) => {
    if (next === tab) return
    setTab(next)
    setCodeActs("")
    setNameTemplate("")
    setPage(1)
    setFkType(next === "extraprotocolares" ? "100" : "")
  }

  useEffect(() => {
    setPage(1)
  }, [codeActs, fkType, nameTemplate])

  return (
    <>
      <div className="mx-auto max-w-6xl px-4 py-6">
        <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Control de plantillas</h1>
            <p className="mt-1 text-sm text-slate-500">
              Busque, filtre y descargue plantillas; cree nuevas cuando las necesite.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCreateOpen(true)}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Nueva plantilla
          </button>
        </header>

        <div className="mb-6 flex gap-1 border-b border-slate-200" role="tablist" aria-label="Ámbito de plantillas">
          <button
            type="button"
            role="tab"
            aria-selected={tab === "protocolares"}
            onClick={() => switchTab("protocolares")}
            className={`relative -mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === "protocolares"
                ? "border-blue-600 text-blue-700"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Protocolares
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={tab === "extraprotocolares"}
            onClick={() => switchTab("extraprotocolares")}
            className={`relative -mb-px border-b-2 px-4 py-2.5 text-sm font-semibold transition-colors ${
              tab === "extraprotocolares"
                ? "border-indigo-600 text-indigo-800"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            Extraprotocolares
          </button>
        </div>

        <PlantillaFilter
          variant={tab}
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
      </div>

      <TopModal isOpen={createOpen} onClose={() => setCreateOpen(false)}>
        <CreatePlantilla
          onCreated={() => setCreateOpen(false)}
          lockedFktypekardex={tab === "extraprotocolares" ? 100 : undefined}
        />
      </TopModal>
    </>
  )
}

export default PlantillasMain
