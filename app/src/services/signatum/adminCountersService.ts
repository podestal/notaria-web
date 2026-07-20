import APIClient from "./apiClient"

export interface AdminCounter {
  id: number
  year: number
  idtipkar: number
  next_num_escritura: number
  next_num_minuta: number
  last_folio: string
  updated_at: string
  admin_action?: {
    action: string
    by_user_id: number
    updated_fields?: string[]
  }
}

export interface AdminCountersFilters {
  year?: string
  idtipkar?: string
}

export interface SetAdminCounterBody {
  year: number
  idtipkar: number
  next_num_escritura?: number
  next_num_minuta?: number
  last_folio?: string
}

export type PatchAdminCounterBody = Partial<
  Pick<AdminCounter, "next_num_escritura" | "next_num_minuta" | "last_folio">
>

export const adminCountersService = new APIClient<AdminCounter[]>(
  "admin/counters/"
)

export const getAdminCounters = (
  access: string,
  filters: AdminCountersFilters = {}
): Promise<AdminCounter[]> => {
  const params: Record<string, string> = {}
  if (filters.year?.trim()) params.year = filters.year.trim()
  if (filters.idtipkar?.trim()) params.idtipkar = filters.idtipkar.trim()
  return adminCountersService.get(access, params)
}

export const getAdminCounter = (
  access: string,
  id: number
): Promise<AdminCounter> => {
  const client = new APIClient<AdminCounter>(`admin/counters/${id}/`)
  return client.get(access)
}

export const getAdminCounterByKey = (
  access: string,
  year: number,
  idtipkar: number
): Promise<AdminCounter> => {
  const client = new APIClient<AdminCounter>("admin/counters/by-key/")
  return client.get(access, {
    year: String(year),
    idtipkar: String(idtipkar),
  })
}

export const setAdminCounter = (
  access: string,
  body: SetAdminCounterBody
): Promise<AdminCounter> => {
  const client = new APIClient<AdminCounter, SetAdminCounterBody>(
    "admin/counters/set/"
  )
  return client.post(body, access)
}

export const patchAdminCounter = (
  access: string,
  id: number,
  body: PatchAdminCounterBody
): Promise<AdminCounter> => {
  const client = new APIClient<AdminCounter, PatchAdminCounterBody>(
    `admin/counters/${id}/`
  )
  return client.update(body, access)
}
