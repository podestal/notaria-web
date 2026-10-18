import { useMemo, useState } from "react"
import { motion } from "framer-motion"
import { Plus, Scale } from "lucide-react"
import useAuthStore from "../../../../store/useAuthStore"
import useGetAbogados from "../../../../hooks/api/abogados/useGetAbogados"
import { Abogado } from "../../../../services/api/abogadosService"
import AbogadoCard from "./components/AbogadoCard"
import CreateAbogado from "./components/CreateAbogado"
import UpdateAbogado from "./components/UpdateAbogado"
import DeleteAbogado from "./components/DeleteAbogado"
import AbogadosTable from "./components/AbogadosTable"
import TopModal from "../../../ui/TopModal"
import LoadingState from "../../../ui/LoadingState"
import ExtraFiltersShell, {
  ExtraFilterTextField,
} from "../../extraprotocolares/ExtraFiltersShell"

const AbogadosMain = () => {
  const access = useAuthStore((s) => s.access_token) || ""
  const { data, isLoading, isError, error } = useGetAbogados({ access })

  const [editingAbogado, setEditingAbogado] = useState<Abogado | null>(null)
  const [deletingAbogado, setDeletingAbogado] = useState<Abogado | null>(null)
  const [openCreateModal, setOpenCreateModal] = useState(false)
  const [search, setSearch] = useState("")

  const abogados = data ?? []
  const filteredAbogados = useMemo(() => {
    const term = search.trim().toLowerCase()
    if (!term) return abogados
    return abogados.filter((abogado) =>
      [
        abogado.razonsocial ?? "",
        abogado.documento ?? "",
        abogado.telefono ?? "",
        abogado.matricula ?? "",
      ]
        .join(" ")
        .toLowerCase()
        .includes(term)
    )
  }, [abogados, search])

  return (
    <>
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
                <Scale className="text-sky-300" size={22} />
              </motion.div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.16em] text-sky-300/90">Configuración</p>
                <h1 className="text-lg font-semibold text-white">Abogados Manager</h1>
                <p className="mt-0.5 text-xs text-slate-400">
                  Cree, edite y elimine abogados registrados en el sistema
                </p>
              </div>
            </div>
            <motion.button
              type="button"
              onClick={() => setOpenCreateModal(true)}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.35 }}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.96 }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/40 bg-sky-500/20 px-3 py-2 text-xs font-semibold text-sky-100 transition hover:bg-sky-500/30"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
              Nuevo abogado
            </motion.button>
          </div>
        </div>

        <ExtraFiltersShell title="Búsqueda por:" columns={1}>
          <ExtraFilterTextField
            label="Buscar"
            value={search}
            onChange={setSearch}
            placeholder="Razón social, documento, teléfono, matrícula…"
            index={0}
          />
        </ExtraFiltersShell>

        {isLoading && (
          <LoadingState message="Cargando abogados…" description="Listado de registros" />
        )}
        {isError && (
          <p className="my-8 text-center text-sm text-rose-600">
            Error al cargar abogados: {error.message}
          </p>
        )}
        {!isLoading && !isError && (
          <AbogadosTable
            abogados={filteredAbogados}
            onEdit={(abogado) => {
              setEditingAbogado(abogado)
              setDeletingAbogado(null)
            }}
            onDelete={(abogado) => setDeletingAbogado(abogado)}
          />
        )}
      </motion.div>

      <TopModal isOpen={openCreateModal} onClose={() => setOpenCreateModal(false)}>
        <AbogadoCard
          title="Crear abogado"
          subtitle="Complete los campos para registrar un abogado."
        >
          <CreateAbogado onDone={() => setOpenCreateModal(false)} />
        </AbogadoCard>
      </TopModal>

      <TopModal isOpen={Boolean(editingAbogado)} onClose={() => setEditingAbogado(null)}>
        <AbogadoCard
          title="Actualizar abogado"
          subtitle="Modifique los datos del abogado seleccionado."
        >
          {editingAbogado && (
            <UpdateAbogado abogado={editingAbogado} onCancel={() => setEditingAbogado(null)} />
          )}
        </AbogadoCard>
      </TopModal>

      <TopModal isOpen={Boolean(deletingAbogado)} onClose={() => setDeletingAbogado(null)}>
        <AbogadoCard title="Eliminar abogado">
          <DeleteAbogado abogado={deletingAbogado} onClose={() => setDeletingAbogado(null)} />
        </AbogadoCard>
      </TopModal>
    </>
  )
}

export default AbogadosMain
