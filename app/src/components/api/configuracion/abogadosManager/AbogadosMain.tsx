import { useMemo, useState } from "react";
import useAuthStore from "../../../../store/useAuthStore";
import useGetAbogados from "../../../../hooks/api/abogados/useGetAbogados";
import { Abogado } from "../../../../services/api/abogadosService";
import AbogadoCard from "./components/AbogadoCard";
import CreateAbogado from "./components/CreateAbogado";
import UpdateAbogado from "./components/UpdateAbogado";
import DeleteAbogado from "./components/DeleteAbogado";
import AbogadosTable from "./components/AbogadosTable";
import TopModal from "../../../ui/TopModal";

const AbogadosMain = () => {
  const access = useAuthStore((s) => s.access_token) || "";
  const { data, isLoading, isError, error } = useGetAbogados({ access });

  const [editingAbogado, setEditingAbogado] = useState<Abogado | null>(null);
  const [deletingAbogado, setDeletingAbogado] = useState<Abogado | null>(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);
  const [search, setSearch] = useState("");

  const abogados = data ?? [];
  const filteredAbogados = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return abogados;
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
    );
  }, [abogados, search]);

  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mantenimiento de Abogados</h1>
          <p className="mt-1 text-sm text-slate-500">
            Cree, edite y elimine abogados registrados en el sistema.
          </p>
        </div>
      </header>

      <AbogadoCard title="Listado de abogados" subtitle="Gestione los registros existentes">
          <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setOpenCreateModal(true)}
              className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
            >
              Nuevo abogado
            </button>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por razon social, documento..."
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-sky-400 focus:ring-2 focus:ring-sky-200 sm:max-w-sm"
            />
          </div>

          {isLoading && (
            <p className="rounded-lg bg-slate-50 p-4 text-center text-sm text-slate-500">
              Cargando abogados...
            </p>
          )}
          {isError && (
            <p className="rounded-lg bg-rose-50 p-4 text-center text-sm text-rose-600">
              Error al cargar abogados: {error.message}
            </p>
          )}
          {!isLoading && !isError && (
            <AbogadosTable
              abogados={filteredAbogados}
              onEdit={(abogado) => {
                setEditingAbogado(abogado);
                setDeletingAbogado(null);
              }}
              onDelete={(abogado) => setDeletingAbogado(abogado)}
            />
          )}
      </AbogadoCard>

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
    </div>
  );
};

export default AbogadosMain;