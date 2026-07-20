import { useEffect, useState } from "react"
import TopModal from "../../../ui/TopModal"
import type { AdminCounter } from "../../../../services/signatum/adminCountersService"
import usePatchAdminCounter from "../../../../hooks/signatum/usePatchAdminCounter"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../../store/useAuthStore"
import useKardexTypesStore from "../../../../hooks/store/useKardexTypesStore"
import getTitleCase from "../../../../utils/getTitleCase"

interface Props {
  counter: AdminCounter | null
  onClose: () => void
}

const EditCounterModal = ({ counter, onClose }: Props) => {
  const access = useAuthStore((s) => s.access_token) || ""
  const notify = useNotificationsStore((s) => s.notify)
  const kardexTypes = useKardexTypesStore((s) => s.kardexTypes)
  const patchCounter = usePatchAdminCounter()

  const [nextEscritura, setNextEscritura] = useState("")
  const [nextMinuta, setNextMinuta] = useState("")
  const [lastFolio, setLastFolio] = useState("")

  const isOpen = counter != null

  useEffect(() => {
    if (!counter) return
    setNextEscritura(String(counter.next_num_escritura ?? ""))
    setNextMinuta(String(counter.next_num_minuta ?? ""))
    setLastFolio(counter.last_folio ?? "")
  }, [counter])

  const tipkarLabel = (id: number) => {
    const found = kardexTypes.find((t) => t.idtipkar === id)
    return found ? getTitleCase(found.nomtipkar) : String(id)
  }

  const handleClose = () => {
    onClose()
  }

  const handleSubmit = () => {
    if (!counter || !access) return

    const escritura = Number(nextEscritura)
    const minuta = Number(nextMinuta)
    if (!Number.isFinite(escritura) || escritura < 0) {
      notify("error", "next_num_escritura debe ser un número válido.")
      return
    }
    if (!Number.isFinite(minuta) || minuta < 0) {
      notify("error", "next_num_minuta debe ser un número válido.")
      return
    }

    patchCounter.mutate(
      {
        access,
        id: counter.id,
        body: {
          next_num_escritura: escritura,
          next_num_minuta: minuta,
          last_folio: lastFolio.trim(),
        },
      },
      {
        onSuccess: (res) => {
          notify(
            "success",
            `Contador ${res.year} / tipkar ${res.idtipkar} actualizado.`
          )
          handleClose()
        },
        onError: (error) => {
          notify("error", error.message || "No se pudo actualizar el contador.")
        },
      }
    )
  }

  return (
    <TopModal isOpen={isOpen} onClose={handleClose} portal>
      <div className="space-y-4 text-slate-800">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Editar contador
          </p>
          <h3 className="text-lg font-semibold">
            {counter
              ? `${counter.year} · ${tipkarLabel(counter.idtipkar)}`
              : "Contador"}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            PATCH por id. Ajusta los próximos números y el último folio.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-slate-600">
            Next nº escritura
            <input
              type="number"
              min={0}
              value={nextEscritura}
              onChange={(e) => setNextEscritura(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Next nº minuta
            <input
              type="number"
              min={0}
              value={nextMinuta}
              onChange={(e) => setNextMinuta(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        </div>

        <label className="block text-xs font-semibold text-slate-600">
          Last folio
          <input
            value={lastFolio}
            onChange={(e) => setLastFolio(e.target.value)}
            placeholder='Ej. 202 VTA o vacío'
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </label>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={patchCounter.isPending}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={patchCounter.isPending || !access}
            className="rounded-lg bg-sky-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {patchCounter.isPending ? "Guardando…" : "Guardar cambios"}
          </button>
        </div>
      </div>
    </TopModal>
  )
}

export default EditCounterModal
