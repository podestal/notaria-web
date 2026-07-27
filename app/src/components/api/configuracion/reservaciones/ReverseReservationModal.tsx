import { useState } from "react"
import { Loader2 } from "lucide-react"
import TopModal from "../../../ui/TopModal"
import type { AdminReservation } from "../../../../services/signatum/adminReservationsService"
import useReverseAdminReservation from "../../../../hooks/signatum/useReverseAdminReservation"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../../store/useAuthStore"

interface Props {
  reservation: AdminReservation | null
  onClose: () => void
}

const ReverseReservationModal = ({ reservation, onClose }: Props) => {
  const access = useAuthStore((s) => s.access_token) || ""
  const notify = useNotificationsStore((s) => s.notify)
  const reverseReservation = useReverseAdminReservation()

  const [reason, setReason] = useState("")
  const [clearKardex, setClearKardex] = useState(true)
  const [hardDelete, setHardDelete] = useState(false)

  const isOpen = reservation != null
  const canSubmit = Boolean(access && reason.trim() && reservation?.status === "CO")

  const handleClose = () => {
    setReason("")
    setClearKardex(true)
    setHardDelete(false)
    onClose()
  }

  const handleSubmit = () => {
    if (!reservation || !canSubmit) return

    reverseReservation.mutate(
      {
        access,
        id: reservation.id,
        body: {
          reason: reason.trim(),
          clear_kardex: clearKardex,
          hard_delete: hardDelete,
        },
      },
      {
        onSuccess: (res) => {
          notify(
            "success",
            `Reservación ${res.kardex || res.id} revertida (${res.status}).`
          )
          handleClose()
        },
        onError: (error) => {
          notify("error", error.message || "No se pudo revertir la reservación.")
        },
      }
    )
  }

  return (
    <TopModal isOpen={isOpen} onClose={handleClose} portal>
      <div className="space-y-4 text-slate-800">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Revertir reservación
          </p>
          <h3 className="text-lg font-semibold">
            {reservation?.kardex || `ID ${reservation?.id}`}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Solo aplica a reservaciones comprometidas (CO). Indica el motivo y
            confirma si deseas limpiar el kardex o eliminar la reserva.
          </p>
        </header>

        <dl className="grid grid-cols-2 gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs">
          <div>
            <dt className="font-semibold text-slate-500">Escritura</dt>
            <dd className="text-slate-800">{reservation?.num_escritura || "—"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-slate-500">Minuta</dt>
            <dd className="text-slate-800">{reservation?.num_minuta || "—"}</dd>
          </div>
        </dl>

        <label className="block text-xs font-semibold text-slate-600">
          Motivo
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Ej. Wrong kardex / duplicate escritura"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </label>

        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3">
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={clearKardex}
              onChange={(e) => setClearKardex(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-semibold">Limpiar kardex</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Remueve la numeración vinculada del kardex asociado.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-2.5 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={hardDelete}
              onChange={(e) => setHardDelete(e.target.checked)}
              className="mt-0.5"
            />
            <span>
              <span className="font-semibold">Eliminación permanente</span>
              <span className="mt-0.5 block text-xs text-slate-500">
                Borra el registro de la reservación (hard delete).
              </span>
            </span>
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={reverseReservation.isPending}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || reverseReservation.isPending}
            className="inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {reverseReservation.isPending && (
              <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin" aria-hidden />
            )}
            {reverseReservation.isPending ? "Revirtiendo…" : "Revertir reservación"}
          </button>
        </div>
      </div>
    </TopModal>
  )
}

export default ReverseReservationModal
