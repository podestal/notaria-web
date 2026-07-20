import { useState } from "react"
import TopModal from "../../../ui/TopModal"
import type {
  AdminReservation,
  AdminReservationReleaseStatus,
} from "../../../../services/signatum/adminReservationsService"
import useReleaseAdminReservation from "../../../../hooks/signatum/useReleaseAdminReservation"
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore"
import useAuthStore from "../../../../store/useAuthStore"

interface Props {
  reservation: AdminReservation | null
  onClose: () => void
}

const ReleaseReservationModal = ({ reservation, onClose }: Props) => {
  const access = useAuthStore((s) => s.access_token) || ""
  const notify = useNotificationsStore((s) => s.notify)
  const releaseReservation = useReleaseAdminReservation()

  const [status, setStatus] = useState<AdminReservationReleaseStatus>("EX")
  const [reason, setReason] = useState("")

  const isOpen = reservation != null
  const canSubmit = Boolean(access && reason.trim() && reservation?.status === "PE")

  const handleClose = () => {
    setStatus("EX")
    setReason("")
    onClose()
  }

  const handleSubmit = () => {
    if (!reservation || !canSubmit) return

    releaseReservation.mutate(
      {
        access,
        id: reservation.id,
        body: {
          status,
          reason: reason.trim(),
        },
      },
      {
        onSuccess: (res) => {
          notify(
            "success",
            `Reservación ${res.kardex || res.id} liberada (${res.status}).`
          )
          handleClose()
        },
        onError: (error) => {
          notify("error", error.message || "No se pudo liberar la reservación.")
        },
      }
    )
  }

  return (
    <TopModal isOpen={isOpen} onClose={handleClose} portal>
      <div className="space-y-4 text-slate-800">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Liberar reservación
          </p>
          <h3 className="text-lg font-semibold">
            {reservation?.kardex || `ID ${reservation?.id}`}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Solo aplica a reservaciones pendientes (PE). Elige expirar (EX) o
            cancelar (CA) e indica el motivo.
          </p>
        </header>

        <label className="block text-xs font-semibold text-slate-600">
          Nuevo estado
          <select
            value={status}
            onChange={(e) =>
              setStatus(e.target.value as AdminReservationReleaseStatus)
            }
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          >
            <option value="EX">Expirada (EX)</option>
            <option value="CA">Cancelada (CA)</option>
          </select>
        </label>

        <label className="block text-xs font-semibold text-slate-600">
          Motivo
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={3}
            placeholder="Ej. Usuario dejó la pantalla abierta; desbloqueando tipkar…"
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
          />
        </label>

        <div className="flex flex-wrap justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={handleClose}
            disabled={releaseReservation.isPending}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit || releaseReservation.isPending}
            className="rounded-lg bg-rose-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {releaseReservation.isPending ? "Liberando…" : "Liberar reservación"}
          </button>
        </div>
      </div>
    </TopModal>
  )
}

export default ReleaseReservationModal
