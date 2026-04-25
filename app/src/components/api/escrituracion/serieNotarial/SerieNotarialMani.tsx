import { useMemo, useState } from "react"
import useCreateSerieNotarial from "../../../../hooks/signatum/useCreateSerieNotarial"
import useGetSeriesNotariales from "../../../../hooks/signatum/useGetSeriesNotariales"
import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import { Loader2 } from "lucide-react"
import useBodyRenderStore from "../../../../hooks/store/bodyRenderStore"

const SerieNotarialMain = () => {
  const access = useAuthStore((s) => s.access_token) || ""
  const { setMessage, setShow, setType } = useNotificationsStore()
  const bodyRender = useBodyRenderStore((s) => s.bodyRender)
  const currentTipoKardex = bodyRender || 1

  const [nombre, setNombre] = useState("")
  const [papelIni, setPapelIni] = useState("")
  const [papelFin, setPapelFin] = useState("")
  const [activo, setActivo] = useState(true)

  const createSerieNotarial = useCreateSerieNotarial()
  const { data: series, isLoading: loadingSeries } = useGetSeriesNotariales({ access })

  const canSubmit = useMemo(
    () => Boolean(access && papelIni.trim() && papelFin.trim()),
    [access, papelIni, papelFin]
  )

  const handleCreateSerie = () => {
    if (!access) {
      setMessage("No hay sesión activa para registrar serie notarial")
      setType("error")
      setShow(true)
      return
    }

    if (!papelIni.trim() || !papelFin.trim()) {
      setMessage("Complete Papel inicial y Papel final")
      setType("error")
      setShow(true)
      return
    }

    createSerieNotarial.mutate(
      {
        access,
        serieNotarial: {
          idtipkar: currentTipoKardex,
          nombre: nombre.trim(),
          papel_ini: papelIni.trim(),
          papel_fin: papelFin.trim(),
          activo,
        },
      },
      {
        onSuccess: () => {
          setMessage("Serie notarial creada correctamente")
          setType("success")
          setShow(true)
          setNombre("")
          setPapelIni("")
          setPapelFin("")
          setActivo(true)
        },
        onError: (error) => {
          setMessage(error.message || "No se pudo crear la serie notarial")
          setType("error")
          setShow(true)
        },
      }
    )
  }

  return (
    <div className="w-full rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-700 px-4 py-3 text-slate-100">
        {/* <p className="text-[11px] uppercase tracking-wider text-slate-300">Signatum</p> */}
        <h3 className="text-sm font-semibold">Serie notarial</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Nombre (opcional)
            </label>
            <input
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Lote abril"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Papel inicial
              </label>
              <input
                value={papelIni}
                onChange={(e) => setPapelIni(e.target.value)}
                placeholder="000120"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Papel final
              </label>
              <input
                value={papelFin}
                onChange={(e) => setPapelFin(e.target.value)}
                placeholder="000160"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              />
            </div>
          </div>

          {/* <div className="pt-2">
            <label className="inline-flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              Serie activa
            </label>
          </div> */}

          <div className="pt-4">
            <button
              type="button"
              onClick={handleCreateSerie}
              disabled={!canSubmit || createSerieNotarial.isPending}
              className="inline-flex min-w-[140px] items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 hover:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {createSerieNotarial.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                "Crear serie"
              )}
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 lg:col-span-2">
          <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Series registradas
          </p>
          <div className="max-h-56 overflow-y-auto pr-1">
            {loadingSeries ? (
              <p className="text-xs text-slate-500">Cargando series...</p>
            ) : (series || []).length === 0 ? (
              <p className="text-xs text-slate-500">Sin registros por ahora.</p>
            ) : (
              <div className="space-y-2">
                {(series || []).slice(0, 8).map((serie) => (
                  <div key={`${serie.id}-${serie.papel_ini}-${serie.papel_fin}`} className="rounded-lg border border-slate-200 bg-white px-3 py-2">
                    <p className="text-xs font-semibold text-slate-700">
                      {serie.nombre?.trim() || "Sin nombre"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {serie.papel_ini} - {serie.papel_fin}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SerieNotarialMain