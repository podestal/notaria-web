import APIClient from "./apiClient"

export interface Confinotario {
  idnotar: number
  nombre: string
  apellido: string
  telefono: string
  correo: string
  ruc: string
  direccion: string | null
  distrito: string | null
  codnotario: string | null
  codoficial: string | null
  coduif: string | null
  islima: number | null
  cajaemail: string | null
  passwordemail: string | null
  ubigeo: string | null
  ructest: string | null
  provincia: string | null
  departamento: string | null
  abrev: string | null
}

export type UpdateConfinotario = Omit<Confinotario, "idnotar">

export const updateConfinotarioService = (notarioId: number) => {
  return new APIClient<Confinotario, UpdateConfinotario>(`/confinotario/${notarioId}/`)

}

const confinotarioService = new APIClient<Confinotario>("/confinotario/")

export default confinotarioService
