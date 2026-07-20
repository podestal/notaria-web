import { useEffect, useState } from "react"
import TopModal from "../../../ui/TopModal"
import useSetAdminCounter from "../../../../hooks/signatum/useSetAdminCounter"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../../store/useAuthStore"
import useKardexTypesStore from "../../../../hooks/store/useKardexTypesStore"
import getTitleCase from "../../../../utils/getTitleCase"
import type { SetAdminCounterBody } from "../../../../services/signatum/adminCountersService"

interface Props {
  isOpen: boolean
  onClose: () => void
  defaultYear?: number
  defaultIdtipkar?: number
}

const SetCounterModal = ({
  isOpen,
  onClose,
  defaultYear,
  defaultIdtipkar,
}: Props) => {
  const access = useAuthStore((s) => s.access_token) || ""
  const notify = useNotificationsStore((s) => s.notify)
  const kardexTypes = useKardexTypesStore((s) => s.kardexTypes)
  const setCounter = useSetAdminCounter()

  const [year, setYear] = useState(String(defaultYear ?? new Date().getFullYear()))
  const [idtipkar, setIdtipkar] = useState(
    defaultIdtipkar != null ? String(defaultIdtipkar) : ""
  )
  const [nextEscritura, setNextEscritura] = useState("")
  const [nextMinuta, setNextMinuta] = useState("")
  const [lastFolio, setLastFolio] = useState("")
  const [includeFolio, setIncludeFolio] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setYear(String(defaultYear ?? new Date().getFullYear()))
    setIdtipkar(defaultIdtipkar != null ? String(defaultIdtipkar) : "")
    setNextEscritura("")
    setNextMinuta("")
    setLastFolio("")
    setIncludeFolio(false)
  }, [isOpen, defaultYear, defaultIdtipkar])

  const handleClose = () => onClose()

  const handleSubmit = () => {
    if (!access) return

    const yearNum = Number(year)
    const tipkarNum = Number(idtipkar)
    if (!Number.isFinite(yearNum) || yearNum < 2000) {
      notify("error", "Año inválido.")
      return
    }
    if (!Number.isFinite(tipkarNum) || tipkarNum <= 0) {
      notify("error", "Seleccione un tipo de kardex.")
      return
    }

    const body: SetAdminCounterBody = {
      year: yearNum,
      idtipkar: tipkarNum,
    }

    if (nextEscritura.trim()) {
      const n = Number(nextEscritura)
      if (!Number.isFinite(n) || n < 0) {
        notify("error", "next_num_escritura inválido.")
        return
      }
      body.next_num_escritura = n
    }
    if (nextMinuta.trim()) {
      const n = Number(nextMinuta)
      if (!Number.isFinite(n) || n < 0) {
        notify("error", "next_num_minuta inválido.")
        return
      }
      body.next_num_minuta = n
    }
    if (includeFolio) {
      body.last_folio = lastFolio.trim()
    }

    if (
      body.next_num_escritura == null &&
      body.next_num_minuta == null &&
      !includeFolio
    ) {
      notify("error", "Indique escritura, minuta y/o folio a actualizar.")
      return
    }

    setCounter.mutate(
      { access, body },
      {
        onSuccess: (res) => {
          notify(
            "success",
            `Contador ${res.year} / tipkar ${res.idtipkar} configurado.`
          )
          handleClose()
        },
        onError: (error) => {
          notify("error", error.message || "No se pudo configurar el contador.")
        },
      }
    )
  }

  return (
    <TopModal isOpen={isOpen} onClose={handleClose} portal>
      <div className="space-y-4 text-slate-800">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Set / reset contador
          </p>
          <h3 className="text-lg font-semibold">Configurar por año y tipkar</h3>
          <p className="mt-1 text-xs text-slate-500">
            POST set. La próxima reserva usará estos valores.
          </p>
        </header>

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block text-xs font-semibold text-slate-600">
            Año
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Tipo de kardex
            <select
              value={idtipkar}
              onChange={(e) => setIdtipkar(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            >
              <option value="">Seleccione…</option>
              {kardexTypes.map((type) => (
                <option key={type.idtipkar} value={String(type.idtipkar)}>
                  {getTitleCase(type.nomtipkar)}
                </option>
              ))}
            </select>
          </label>
          <label className="block text-xs font-semibold text-slate-600">
            Next nº escritura
            <input
              type="number"
              min={0}
              value={nextEscritura}
              onChange={(e) => setNextEscritura(e.target.value)}
              placeholder="Opcional"
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
              placeholder="Opcional"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </label>
        </div>

        <div className="space-y-2">
          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600">
            <input
              type="checkbox"
              checked={includeFolio}
              onChange={(e) => setIncludeFolio(e.target.checked)}
              className="rounded border-slate-300"
            />
            Actualizar last folio
          </label>
          <input
            value={lastFolio}
            onChange={(e) => setLastFolio(e.target.value)}
            disabled={!includeFolio}
            placeholder='Ej. 202 VTA (vacío = limpiar)'
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200 disabled:bg-slate-100 disabled:text-slate-400"
          />
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={setCounter.isPending}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={setCounter.isPending || !access}
            className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {setCounter.isPending ? "Guardando…" : "Aplicar set"}
          </button>
        </div>
      </div>
    </TopModal>
  )
}

export default SetCounterModal
