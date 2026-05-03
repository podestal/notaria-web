import APIClient from "./apiClient"

export interface SerieNotarial {
  id?: number
  idtipkar: number
  nombre: string
  papel_ini: string
  papel_fin: string
  activo: boolean
  created_at?: string
}

export type CreateSerieNotarial = Omit<SerieNotarial, "id" | "created_at">

export const serieNotarialService = new APIClient<SerieNotarial[], CreateSerieNotarial>(
  "series-notariales/"
)

export const updateSerieNotarial = (
  access: string,
  id: number,
  body: Partial<Pick<SerieNotarial, "activo" | "nombre" | "papel_ini" | "papel_fin">>
): Promise<SerieNotarial> => {
  const client = new APIClient<SerieNotarial, typeof body>(`series-notariales/${id}/`)
  return client.update(body, access)
}

