import { Pencil, Trash2 } from "lucide-react";
import { Abogado } from "../../../../../services/api/abogadosService";

interface Props {
    abogados: Abogado[];
    onEdit: (abogado: Abogado) => void;
    onDelete: (abogado: Abogado) => void;
}

const valueOrDash = (value: string | null | undefined) => {
    const trimmed = (value ?? "").trim();
    return trimmed || "-";
};

const AbogadosTable = ({ abogados, onEdit, onDelete }: Props) => {
    if (!abogados.length) {
        return (
            <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-sm text-slate-500">
                No hay abogados registrados.
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="min-w-full divide-y divide-slate-200 bg-white text-sm">
                <thead className="bg-slate-50">
                    <tr>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">ID</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Razon Social</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Documento</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Telefono</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Matricula</th>
                        <th className="px-3 py-2 text-left font-semibold text-slate-600">Distrito</th>
                        <th className="px-3 py-2 text-right font-semibold text-slate-600">Acciones</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {abogados.map((abogado) => (
                        <tr key={abogado.idabogado} className="hover:bg-slate-50">
                            <td className="px-3 py-2 font-medium text-slate-700">{abogado.idabogado}</td>
                            <td className="px-3 py-2 text-slate-700">{valueOrDash(abogado.razonsocial)}</td>
                            <td className="px-3 py-2 text-slate-700">{valueOrDash(abogado.documento)}</td>
                            <td className="px-3 py-2 text-slate-700">{valueOrDash(abogado.telefono)}</td>
                            <td className="px-3 py-2 text-slate-700">{valueOrDash(abogado.matricula)}</td>
                            <td className="px-3 py-2 text-slate-700">{valueOrDash(abogado.distrito)}</td>
                            <td className="px-3 py-2">
                                <div className="flex justify-end gap-2">
                                    <button
                                        type="button"
                                        onClick={() => onEdit(abogado)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100"
                                    >
                                        <Pencil className="h-3.5 w-3.5" />
                                        Editar
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(abogado)}
                                        className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AbogadosTable;
