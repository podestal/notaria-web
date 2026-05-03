import { useMemo, useState } from "react"
import useCreateSerieNotarial from "../../../../hooks/signatum/useCreateSerieNotarial"
import useDeactivateSerieNotarial from "../../../../hooks/signatum/useDeactivateSerieNotarial"
import useGetSeriesNotariales from "../../../../hooks/signatum/useGetSeriesNotariales"
import useAuthStore from "../../../../store/useAuthStore"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useUserInfoStore from "../../../../hooks/store/useGetUserInfo"
import type { SerieNotarial } from "../../../../services/signatum/serieNotarialService"
import { Loader2 } from "lucide-react"
import useBodyRenderStore from "../../../../hooks/store/bodyRenderStore"

/** Valor numérico del papel (solo dígitos) para validar rango. */
const parsePapelNumerico = (raw: string): number | null => {
  const m = raw.trim().match(/^(\d+)$/)
  if (!m) return null
  const n = parseInt(m[1], 10)
  return Number.isFinite(n) ? n : null
}

const SerieNotarialMain = () => {
  const access = useAuthStore((s) => s.access_token) || ""
  const user = useUserInfoStore((s) => s.user)
  const { setMessage, setShow, setType } = useNotificationsStore()
  const bodyRender = useBodyRenderStore((s) => s.bodyRender)
  const currentTipoKardex = bodyRender || 1

  const canDeactivateSerie = useMemo(
    () => Number(user?.is_superuser) !== 0 || Number(user?.is_staff) !== 0,
    [user?.is_superuser, user?.is_staff]
  )

  const [nombre, setNombre] = useState("")
  const [papelIni, setPapelIni] = useState("")
  const [papelFin, setPapelFin] = useState("")
  const [activo, setActivo] = useState(true)

  const createSerieNotarial = useCreateSerieNotarial()
  const deactivateSerieNotarial = useDeactivateSerieNotarial()
  const [serieConfirmDeactivate, setSerieConfirmDeactivate] = useState<SerieNotarial | null>(null)

  const { data: series, isLoading: loadingSeries } = useGetSeriesNotariales({
    access,
    idtipkar: currentTipoKardex,
  })

  const hasActiveSerie = useMemo(
    () =>
      (series || []).some(
        (s) => Boolean(s.activo) && Number(s.idtipkar) === Number(currentTipoKardex)
      ),
    [series, currentTipoKardex]
  )

  const papelRangoValido = useMemo(() => {
    const ini = papelIni.trim()
    const fin = papelFin.trim()
    if (!ini || !fin) return true
    const nIni = parsePapelNumerico(ini)
    const nFin = parsePapelNumerico(fin)
    if (nIni == null || nFin == null) return false
    return nIni <= nFin
  }, [papelIni, papelFin])

  const canSubmit = useMemo(
    () =>
      Boolean(access && papelIni.trim() && papelFin.trim()) &&
      !hasActiveSerie &&
      papelRangoValido,
    [access, papelIni, papelFin, hasActiveSerie, papelRangoValido]
  )

  const handleCreateSerie = () => {
    if (!access) {
      setMessage("No hay sesión activa para registrar serie notarial")
      setType("error")
      setShow(true)
      return
    }

    if (hasActiveSerie) {
      setMessage(
        "Ya hay una serie notarial activa para este tipo de kardex. Desactívela o cierre el rango antes de crear otra."
      )
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

    const nIni = parsePapelNumerico(papelIni)
    const nFin = parsePapelNumerico(papelFin)
    if (nIni == null || nFin == null) {
      setMessage("Papel inicial y final deben ser valores numéricos (solo dígitos).")
      setType("error")
      setShow(true)
      return
    }
    if (nIni > nFin) {
      setMessage("El papel inicial no puede ser mayor que el papel final.")
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

  const handleConfirmDeactivate = () => {
    if (!canDeactivateSerie) {
      setSerieConfirmDeactivate(null)
      return
    }
    if (!access || !serieConfirmDeactivate?.id) {
      setMessage("No se puede desactivar: falta identificador de la serie.")
      setType("error")
      setShow(true)
      setSerieConfirmDeactivate(null)
      return
    }
    deactivateSerieNotarial.mutate(
      {
        access,
        id: serieConfirmDeactivate.id,
        idtipkar: currentTipoKardex,
      },
      {
        onSuccess: () => {
          setSerieConfirmDeactivate(null)
          setMessage("Serie notarial desactivada correctamente")
          setType("success")
          setShow(true)
        },
        onError: (error) => {
          setMessage(error.message || "No se pudo desactivar la serie notarial")
          setType("error")
          setShow(true)
        },
      }
    )
  }

  return (
    <div className="relative w-full rounded-2xl border border-slate-200 bg-white">
      <div className="border-b border-slate-200 bg-gradient-to-r from-slate-800 via-slate-700 to-slate-700 px-4 py-3 text-slate-100">
        {/* <p className="text-[11px] uppercase tracking-wider text-slate-300">Signatum</p> */}
        <h3 className="text-sm font-semibold">Serie notarial</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 p-4 lg:grid-cols-5">
        <div className="space-y-3 lg:col-span-3">
          {hasActiveSerie && !loadingSeries && (
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
              Ya existe una serie notarial activa. No puede crear otra hasta que la actual quede inactiva o se
              gestione desde el sistema correspondiente.
            </div>
          )}
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
          {papelIni.trim() && papelFin.trim() && !papelRangoValido && (
            <p className="text-xs text-red-600">
              El papel inicial no puede ser mayor que el papel final. Use solo dígitos en ambos campos.
            </p>
          )}

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
              disabled={!canSubmit || createSerieNotarial.isPending || loadingSeries}
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
                {(series || []).map((serie) => (
                  <div
                    key={`${serie.id}-${serie.papel_ini}-${serie.papel_fin}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-slate-700">
                          {serie.nombre?.trim() || "Sin nombre"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {serie.papel_ini} - {serie.papel_fin}
                        </p>
                        {!serie.activo && (
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                            Inactiva
                          </p>
                        )}
                      </div>
                      {canDeactivateSerie && Boolean(serie.activo) && serie.id != null && (
                        <button
                          type="button"
                          onClick={() => setSerieConfirmDeactivate(serie)}
                          className="shrink-0 rounded-md border border-rose-200 bg-rose-50 px-2 py-1 text-[10px] font-semibold text-rose-700 transition hover:bg-rose-100"
                        >
                          Desactivar
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {serieConfirmDeactivate && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/45 p-4"
          role="presentation"
          onClick={() => !deactivateSerieNotarial.isPending && setSerieConfirmDeactivate(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="serie-deactivate-title"
            className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h4 id="serie-deactivate-title" className="text-sm font-semibold text-slate-800">
              Desactivar serie notarial
            </h4>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              ¿Confirma que desea desactivar la serie{" "}
              <span className="font-semibold text-slate-800">
                {serieConfirmDeactivate.nombre?.trim() || "sin nombre"}
              </span>{" "}
              ({serieConfirmDeactivate.papel_ini} – {serieConfirmDeactivate.papel_fin})? Podrá crear una nueva serie
              activa después de desactivarla.
            </p>
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                disabled={deactivateSerieNotarial.isPending}
                onClick={() => setSerieConfirmDeactivate(null)}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={deactivateSerieNotarial.isPending}
                onClick={handleConfirmDeactivate}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-600 bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:opacity-60"
              >
                {deactivateSerieNotarial.isPending ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Desactivando…
                  </>
                ) : (
                  "Sí, desactivar"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SerieNotarialMain