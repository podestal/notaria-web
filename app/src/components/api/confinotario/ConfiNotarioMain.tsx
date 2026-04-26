import { useEffect, useMemo, useState } from "react"
import { Loader2, Save } from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useGetConfinotario from "../../../hooks/api/confinotario/useGetConfinotario"
import useUpdateConfinotario from "../../../hooks/api/confinotario/useUpdateConfinotario"
import { UpdateConfinotario } from "../../../services/api/confinotarioService"
import ConfiNotarioField from "./components/ConfiNotarioField"
import ConfiNotarioSection from "./components/ConfiNotarioSection"

const emptyForm: UpdateConfinotario = {
  nombre: "",
  apellido: "",
  telefono: "",
  correo: "",
  ruc: "",
  direccion: null,
  distrito: null,
  codnotario: null,
  codoficial: null,
  coduif: null,
  islima: null,
  cajaemail: null,
  passwordemail: null,
  ubigeo: null,
  ructest: null,
  provincia: null,
  departamento: null,
  abrev: null,
}

const toNullable = (value: string): string | null => (value.trim() ? value.trim() : null)

const ConfiNotarioMain = () => {
  const access = useAuthStore((s) => s.access_token) || ""
  const { setMessage, setShow, setType } = useNotificationsStore()

  const { data, isLoading, isError, error } = useGetConfinotario({ access })
  const updateConfinotario = useUpdateConfinotario()

  const [form, setForm] = useState<UpdateConfinotario>(emptyForm)

  useEffect(() => {
    if (!data) return
    setForm({
      nombre: data.nombre || "",
      apellido: data.apellido || "",
      telefono: data.telefono || "",
      correo: data.correo || "",
      ruc: data.ruc || "",
      direccion: data.direccion ?? null,
      distrito: data.distrito ?? null,
      codnotario: data.codnotario ?? null,
      codoficial: data.codoficial ?? null,
      coduif: data.coduif ?? null,
      islima: data.islima ?? null,
      cajaemail: data.cajaemail ?? null,
      passwordemail: data.passwordemail ?? null,
      ubigeo: data.ubigeo ?? null,
      ructest: data.ructest ?? null,
      provincia: data.provincia ?? null,
      departamento: data.departamento ?? null,
      abrev: data.abrev ?? null,
    })
  }, [data])

  const isInvalid = useMemo(() => {
    return !form.nombre.trim() || !form.apellido.trim() || !form.telefono.trim() || !form.correo.trim() || !form.ruc.trim()
  }, [form])

  const handleChange = (key: keyof UpdateConfinotario, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!access) {
      setMessage("No hay sesión activa")
      setType("error")
      setShow(true)
      return
    }
    if (isInvalid) {
      setMessage("Complete los campos requeridos: nombre, apellido, telefono, correo y ruc")
      setType("error")
      setShow(true)
      return
    }

    updateConfinotario.mutate(
      {
        access,
        idnotar: data.idnotar,
        confinotario: {
          nombre: form.nombre.trim(),
          apellido: form.apellido.trim(),
          telefono: form.telefono.trim(),
          correo: form.correo.trim(),
          ruc: form.ruc.trim(),
          direccion: toNullable(String(form.direccion ?? "")),
          distrito: toNullable(String(form.distrito ?? "")),
          codnotario: toNullable(String(form.codnotario ?? "")),
          codoficial: toNullable(String(form.codoficial ?? "")),
          coduif: toNullable(String(form.coduif ?? "")),
          islima: form.islima,
          cajaemail: toNullable(String(form.cajaemail ?? "")),
          passwordemail: toNullable(String(form.passwordemail ?? "")),
          ubigeo: toNullable(String(form.ubigeo ?? "")),
          ructest: toNullable(String(form.ructest ?? "")),
          provincia: toNullable(String(form.provincia ?? "")),
          departamento: toNullable(String(form.departamento ?? "")),
          abrev: toNullable(String(form.abrev ?? "")),
        },
      },
      {
        onSuccess: () => {
          setMessage("Configuracion del notario actualizada correctamente")
          setType("success")
          setShow(true)
        },
        onError: (err) => {
          setMessage(err.message || "No se pudo actualizar la configuracion del notario")
          setType("error")
          setShow(true)
        },
      }
    )
  }

  if (isLoading) return <p className="my-8 text-center text-sm text-slate-500">Cargando configuracion del notario...</p>
  if (isError) return <p className="my-8 text-center text-sm text-rose-600">Error: {error.message}</p>

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Datos del Notario</h1>
          <p className="mt-1 text-sm text-slate-500">
            Administre la informacion institucional y codigos de configuracion.
          </p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-4">
          <ConfiNotarioSection
            title="Datos Principales"
            subtitle="Informacion general del notario y datos obligatorios"
          >
            <ConfiNotarioField label="Nombre" value={form.nombre} required onChange={(value) => handleChange("nombre", value)} />
            <ConfiNotarioField label="Apellido" value={form.apellido} required onChange={(value) => handleChange("apellido", value)} />
            <ConfiNotarioField label="Telefono" value={form.telefono} required onChange={(value) => handleChange("telefono", value)} />
            <ConfiNotarioField label="Correo" value={form.correo} type="email" required onChange={(value) => handleChange("correo", value)} />
            <ConfiNotarioField label="RUC" value={form.ruc} required onChange={(value) => handleChange("ruc", value)} />
            <ConfiNotarioField label="RUC Test" value={form.ructest ?? ""} onChange={(value) => handleChange("ructest", value)} />
            <ConfiNotarioField label="Abreviatura" value={form.abrev ?? ""} onChange={(value) => handleChange("abrev", value)} />
          </ConfiNotarioSection>

          <ConfiNotarioSection
            title="Ubicacion"
            subtitle="Direccion y datos geograficos de la notaria"
          >
            <ConfiNotarioField label="Direccion" value={form.direccion ?? ""} onChange={(value) => handleChange("direccion", value)} />
            <ConfiNotarioField label="Distrito" value={form.distrito ?? ""} onChange={(value) => handleChange("distrito", value)} />
            <ConfiNotarioField label="Provincia" value={form.provincia ?? ""} onChange={(value) => handleChange("provincia", value)} />
            <ConfiNotarioField label="Departamento" value={form.departamento ?? ""} onChange={(value) => handleChange("departamento", value)} />
            <ConfiNotarioField label="Ubigeo" value={form.ubigeo ?? ""} onChange={(value) => handleChange("ubigeo", value)} />
            <label className="flex flex-col gap-1">
              <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Es Lima</span>
              <select
                value={form.islima === null ? "" : String(form.islima)}
                onChange={(e) => setForm((prev) => ({ ...prev, islima: e.target.value === "" ? null : Number(e.target.value) }))}
                className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              >
                <option value="">No definido</option>
                <option value="1">Si</option>
                <option value="0">No</option>
              </select>
            </label>
          </ConfiNotarioSection>

          <ConfiNotarioSection
            title="Codigos Institucionales"
            subtitle="Identificadores para integraciones y reportes"
          >
            <ConfiNotarioField label="Cod. Notario" value={form.codnotario ?? ""} onChange={(value) => handleChange("codnotario", value)} />
            <ConfiNotarioField label="Cod. Oficial" value={form.codoficial ?? ""} onChange={(value) => handleChange("codoficial", value)} />
            <ConfiNotarioField label="Cod. UIF" value={form.coduif ?? ""} onChange={(value) => handleChange("coduif", value)} />
          </ConfiNotarioSection>

          <ConfiNotarioSection
            title="Correo de Caja"
            subtitle="Credenciales usadas para envios desde caja"
          >
            <ConfiNotarioField label="Caja Email" value={form.cajaemail ?? ""} onChange={(value) => handleChange("cajaemail", value)} />
            <ConfiNotarioField label="Password Email" value={form.passwordemail ?? ""} onChange={(value) => handleChange("passwordemail", value)} />
          </ConfiNotarioSection>
        </div>

        <div className="mt-5 flex justify-end border-t border-slate-200 pt-4">
          <button
            type="submit"
            disabled={updateConfinotario.isPending || isInvalid}
            className="inline-flex items-center gap-2 rounded-lg border border-blue-700 bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-px hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
          >
            {updateConfinotario.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Guardar cambios
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ConfiNotarioMain