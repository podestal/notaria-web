import { useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import TopModal from "../../../../ui/TopModal";
import { ViajeContratante } from "../../../../../services/api/extraprotocolares/viajeContratanteService";
import { Pencil } from "lucide-react";
import UpdateParticipanteForm from "./UpdateParticipanteForm";
import useUpdateContratante from "../../../../../hooks/api/extraprotocolares/permisosViaje/contratantes/useUpdateContratante";
import UpdateCliente from "../../../clientes/UpdateCliente";
import { Cliente } from "../../../../../services/api/cliente1Service";
import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";

interface Props {
    contratanteViaje: ViajeContratante;
}

const formatClienteNombre = (cliente: Cliente): string => {
    const nombreCompleto = `${cliente.apepat} ${cliente.apemat}, ${cliente.prinom} ${cliente.segnom}`
        .replace(/\s+/g, " ")
        .trim();
    return nombreCompleto || cliente.nombre || "";
};

const UpdateParticipante = ({ contratanteViaje }: Props) => {

    const access = useAuthStore(s => s.access_token) || "";
    const { setMessage, setShow, setType } = useNotificationsStore();
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [openEditCliente, setOpenEditCliente] = useState(false);
    const [cliente1, setCliente1] = useState<Cliente | null>(null);
    const [loadingCliente, setLoadingCliente] = useState(false);
    const [displayNombres, setDisplayNombres] = useState(contratanteViaje.c_descontrat || "");

    const documento = contratanteViaje.c_codcontrat || "";

    const updateContratante = useUpdateContratante({
        viaje_id: contratanteViaje.id_viaje,
        contratanteId: contratanteViaje.id_contratante,
    });

    const handleSetCliente1: React.Dispatch<React.SetStateAction<Cliente | null>> = (value) => {
        setCliente1((prev) => {
            const next = typeof value === "function" ? value(prev) : value;
            if (next) {
                setDisplayNombres(formatClienteNombre(next));
                queryClient.invalidateQueries({
                    queryKey: ["viaje_contratantes", contratanteViaje.id_viaje],
                });
            }
            return next;
        });
    };

    const openClienteEditor = async () => {
        if (!documento) return;

        setLoadingCliente(true);
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${documento}`,
                { headers: { Authorization: `JWT ${access}` } }
            );

            if (!response.data?.idcliente) {
                setType("error");
                setMessage("No se encontró el cliente asociado a este participante.");
                setShow(true);
                return;
            }

            setCliente1(response.data);
            setDisplayNombres(formatClienteNombre(response.data));
            setOpenEditCliente(true);
        } catch {
            setType("error");
            setMessage("Error al cargar los datos del cliente.");
            setShow(true);
        } finally {
            setLoadingCliente(false);
        }
    };

    const closeEditCliente = () => {
        setOpenEditCliente(false);
    };

  return (
    <>
    <button
        onClick={() => {
            setDisplayNombres(contratanteViaje.c_descontrat || "");
            setOpen(true);
        }}
        type="button"
    >
        <Pencil
            size={20}
            className="text-blue-500 hover:text-blue-400 cursor-pointer"
        />
    </button>
    <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
    >
        <UpdateParticipanteForm
            contratanteViaje={contratanteViaje}
            documento={documento}
            nombres={displayNombres}
            onEditCliente={openClienteEditor}
            loadingCliente={loadingCliente}
            setOpen={setOpen}
            updateContratante={updateContratante}
        />
    </TopModal>
    <TopModal
        isOpen={openEditCliente}
        onClose={closeEditCliente}
        deepth={50}
    >
        {cliente1 && (
            <UpdateCliente
                dni={documento}
                cliente1={cliente1}
                setCliente1={handleSetCliente1}
                setShowClienteForm={setOpenEditCliente}
                setShowContratanteForm={() => {}}
                selectedTipoDocumento={cliente1.idtipdoc ?? 1}
                selectedTipoPersona={cliente1.tipper === "J" ? 2 : 1}
            />
        )}
    </TopModal>
    </>
  )
}

export default UpdateParticipante
