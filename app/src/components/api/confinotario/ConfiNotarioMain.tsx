import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import {
  Building2,
  Hash,
  Loader2,
  Mail,
  MapPin,
  Save,
  UserRound,
} from "lucide-react"
import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useGetConfinotario from "../../../hooks/api/confinotario/useGetConfinotario"
import useUpdateConfinotario from "../../../hooks/api/confinotario/useUpdateConfinotario"
import { UpdateConfinotario } from "../../../services/api/confinotarioService"
import ConfiNotarioField from "./components/ConfiNotarioField"
import ConfiNotarioSection from "./components/ConfiNotarioSection"
import LoadingState from "../../ui/LoadingState"

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
    if (!data?.idnotar) {
      setMessage("No se encontró el registro del notario")
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
          setMessage("Configuración del notario actualizada correctamente")
          setType("success")
          setShow(true)
        },
        onError: (err) => {
          const backendMessage =
            (err as any)?.response?.data?.detail ||
            (err as any)?.response?.data?.message ||
            err.message ||
            "No se pudo actualizar la configuración del notario"
          setMessage(backendMessage)
          setType("error")
          setShow(true)
        },
      }
    )
  }

  if (isLoading) {
    return (
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <LoadingState message="Cargando datos…" description="Configuración del notario" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="overflow-hidden rounded-2xl border border-rose-200 bg-rose-50/60 p-8 text-center">
        <p className="text-sm font-medium text-rose-700">Error: {error.message}</p>
      </div>
    )
  }

  const displayName = [form.nombre, form.apellido].filter(Boolean).join(" ").trim()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
    >
        <div className="keep-dark relative overflow-hidden border-b border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 px-6 py-5 text-slate-100">
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-sky-500/20 blur-3xl"
            animate={{ scale: [1, 1.15, 1], opacity: [0.55, 0.85, 0.55] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -bottom-24 left-1/4 h-48 w-48 rounded-full bg-indigo-500/20 blur-3xl"
            animate={{ scale: [1.1, 1, 1.1], opacity: [0.45, 0.75, 0.45] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <motion.div
                initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.08 }}
                className="rounded-xl border border-sky-400/30 bg-sky-500/15 p-2.5"
              >
                <Building2 className="text-sky-300" size={22} />
              </motion.div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Configuración</p>
                <h1 className="text-lg font-semibold text-white">Datos del Notario</h1>
                <p className="mt-0.5 text-xs text-slate-400">
                  Información institucional y códigos de configuración
                </p>
              </div>
            </div>
            {displayName ? (
              <motion.div
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15, duration: 0.35 }}
                className="flex items-center gap-2 rounded-xl border border-slate-600/80 bg-slate-800/70 px-3 py-2"
              >
                <UserRound size={14} className="text-sky-300" />
                <p className="text-xs font-medium text-slate-200">{displayName}</p>
              </motion.div>
            ) : null}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50/50 p-4 sm:p-5">
          <ConfiNotarioSection
            index={0}
            icon={UserRound}
            title="Datos principales"
            subtitle="Información general del notario y campos obligatorios"
          >
            <ConfiNotarioField index={0} label="Nombre" value={form.nombre} required onChange={(value) => handleChange("nombre", value)} />
            <ConfiNotarioField index={1} label="Apellido" value={form.apellido} required onChange={(value) => handleChange("apellido", value)} />
            <ConfiNotarioField index={2} label="Teléfono" value={form.telefono} required onChange={(value) => handleChange("telefono", value)} />
            <ConfiNotarioField index={3} label="Correo" value={form.correo} type="email" required onChange={(value) => handleChange("correo", value)} />
            <ConfiNotarioField index={4} label="RUC" value={form.ruc} required onChange={(value) => handleChange("ruc", value)} />
            <ConfiNotarioField index={5} label="RUC Test" value={form.ructest ?? ""} onChange={(value) => handleChange("ructest", value)} />
            <ConfiNotarioField index={6} label="Abreviatura" value={form.abrev ?? ""} onChange={(value) => handleChange("abrev", value)} />
          </ConfiNotarioSection>

          <ConfiNotarioSection
            index={1}
            icon={MapPin}
            title="Ubicación"
            subtitle="Dirección y datos geográficos de la notaría"
          >
            <ConfiNotarioField index={0} label="Dirección" value={form.direccion ?? ""} onChange={(value) => handleChange("direccion", value)} className="md:col-span-2" />
            <ConfiNotarioField index={1} label="Distrito" value={form.distrito ?? ""} onChange={(value) => handleChange("distrito", value)} />
            <ConfiNotarioField index={2} label="Provincia" value={form.provincia ?? ""} onChange={(value) => handleChange("provincia", value)} />
            <ConfiNotarioField index={3} label="Departamento" value={form.departamento ?? ""} onChange={(value) => handleChange("departamento", value)} />
            <ConfiNotarioField index={4} label="Ubigeo" value={form.ubigeo ?? ""} onChange={(value) => handleChange("ubigeo", value)} />
            <motion.label
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.28, delay: 0.15 }}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-2 transition-shadow focus-within:border-sky-300 focus-within:shadow-md focus-within:shadow-sky-100"
            >
              <span className="min-w-[6.5rem] shrink-0 text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                Es Lima
              </span>
              <select
                value={form.islima === null ? "" : String(form.islima)}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    islima: e.target.value === "" ? null : Number(e.target.value),
                  }))
                }
                className="w-full min-w-0 rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200"
              >
                <option value="">No definido</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </select>
            </motion.label>
          </ConfiNotarioSection>

          <ConfiNotarioSection
            index={2}
            icon={Hash}
            title="Códigos institucionales"
            subtitle="Identificadores para integraciones y reportes"
            columns={3}
          >
            <ConfiNotarioField index={0} label="Cod. Notario" value={form.codnotario ?? ""} onChange={(value) => handleChange("codnotario", value)} />
            <ConfiNotarioField index={1} label="Cod. Oficial" value={form.codoficial ?? ""} onChange={(value) => handleChange("codoficial", value)} />
            <ConfiNotarioField index={2} label="Cod. UIF" value={form.coduif ?? ""} onChange={(value) => handleChange("coduif", value)} />
          </ConfiNotarioSection>

          <ConfiNotarioSection
            index={3}
            icon={Mail}
            title="Correo de caja"
            subtitle="Credenciales usadas para envíos desde caja"
          >
            <ConfiNotarioField index={0} label="Caja Email" value={form.cajaemail ?? ""} type="email" onChange={(value) => handleChange("cajaemail", value)} />
            <ConfiNotarioField index={1} label="Password Email" value={form.passwordemail ?? ""} type="password" onChange={(value) => handleChange("passwordemail", value)} />
          </ConfiNotarioSection>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="sticky bottom-3 z-10 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur"
          >
            <p className="text-[11px] text-slate-400">
              {isInvalid
                ? "Complete los campos marcados con * para guardar"
                : "Los cambios se aplicarán al guardar"}
            </p>
            <motion.button
              type="submit"
              disabled={updateConfinotario.isPending || isInvalid}
              whileHover={updateConfinotario.isPending || isInvalid ? undefined : { y: -1 }}
              whileTap={updateConfinotario.isPending || isInvalid ? undefined : { scale: 0.96 }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-blue-700 bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {updateConfinotario.isPending ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-3.5 w-3.5" />
                  Guardar cambios
                </>
              )}
            </motion.button>
          </motion.div>
        </form>
    </motion.div>
  )
}

export default ConfiNotarioMain
