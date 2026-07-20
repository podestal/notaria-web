import APIClient from "./apiClient"

export interface AdminReservation {
  id: number
  idtipkar: number
  kardex: string
  folio_ini: string
  folio_fin: string
  papel_ini: string
  papel_fin: string
  num_minuta: string
  num_escritura: string
  fecha_escritura: string
  fecha_conclusion: string
  status: string
  held_by: number
  held_by_username: string
  created_at: string
  admin_action?: {
    action: string
    reason: string
    by_user_id: number
  }
}

export type AdminReservationReleaseStatus = "EX" | "CA"

export interface ReleaseAdminReservationBody {
  status: AdminReservationReleaseStatus
  reason: string
}

export interface AdminReservationsPage {
  count: number
  next: string | null
  previous: string | null
  results: AdminReservation[]
}

export interface AdminReservationsFilters {
  status?: string
  idtipkar?: string
  kardex?: string
  held_by?: string
  page?: number
  page_size?: number
}

export const adminReservationsService = new APIClient<AdminReservationsPage>(
  "admin/reservations/"
)

export const getAdminReservation = (
  access: string,
  id: number
): Promise<AdminReservation> => {
  const client = new APIClient<AdminReservation>(`admin/reservations/${id}/`)
  return client.get(access)
}

export const getAdminReservations = (
  access: string,
  filters: AdminReservationsFilters = {}
): Promise<AdminReservationsPage> => {
  const params: Record<string, string> = {}
  if (filters.status?.trim()) params.status = filters.status.trim()
  if (filters.idtipkar?.trim()) params.idtipkar = filters.idtipkar.trim()
  if (filters.kardex?.trim()) params.kardex = filters.kardex.trim()
  if (filters.held_by?.trim()) params.held_by = filters.held_by.trim()
  if (filters.page != null) params.page = String(filters.page)
  if (filters.page_size != null) params.page_size = String(filters.page_size)
  return adminReservationsService.get(access, params)
}

export const releaseAdminReservation = (
  access: string,
  id: number,
  body: ReleaseAdminReservationBody
): Promise<AdminReservation> => {
  const client = new APIClient<AdminReservation, ReleaseAdminReservationBody>(
    `admin/reservations/${id}/release/`
  )
  return client.post(body, access)
}
