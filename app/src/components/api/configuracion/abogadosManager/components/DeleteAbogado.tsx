import { Abogado } from "../../../../../services/api/abogadosService";
import useDeleteAbogado from "../../../../../hooks/api/abogados/useDeleteAbogado";
import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";

interface Props {
    abogado: Abogado | null;
    onClose: () => void;
}

const DeleteAbogado = ({ abogado, onClose }: Props) => {
    const access = useAuthStore((s) => s.access_token) || "";
    const { setMessage, setShow, setType } = useNotificationsStore();
    const deleteAbogado = useDeleteAbogado({ idabogado: abogado?.idabogado || "" });

    if (!abogado) return null;

    const handleDelete = async () => {
        await deleteAbogado.mutateAsync(
            { access },
            {
                onSuccess: () => {
                    setMessage("Abogado eliminado correctamente");
                    setType("success");
                    setShow(true);
                    onClose();
                },
                onError: (error) => {
                    const backendMessage =
                        (error as any)?.response?.data?.detail ||
                        (error as any)?.response?.data?.message ||
                        "No se pudo eliminar el abogado";
                    setMessage(String(backendMessage));
                    setType("error");
                    setShow(true);
                },
            }
        );
    };

    return (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4">
            <p className="text-sm text-rose-700">
                Seguro que desea eliminar al abogado <span className="font-semibold">{abogado.razonsocial}</span>?
            </p>
            <div className="mt-3 flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleteAbogado.isPending}
                    className="rounded-lg border border-rose-700 bg-rose-600 px-3 py-2 text-xs font-semibold text-white hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {deleteAbogado.isPending ? "Eliminando..." : "Eliminar"}
                </button>
            </div>
        </div>
    );
};

export default DeleteAbogado;
