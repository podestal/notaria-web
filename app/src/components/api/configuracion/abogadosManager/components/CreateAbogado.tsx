import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";
import useCreateAbogado from "../../../../../hooks/api/abogados/useCreateAbogado";
import AbogadoForm, { AbogadoFormValues } from "./AbogadoForm";
import { CreateUpdateAbogado } from "../../../../../services/api/abogadosService";

interface Props {
    onDone?: () => void;
}

const emptyValues: AbogadoFormValues = {
    razonsocial: "",
    direccion: "",
    distrito: "",
    documento: "",
    telefono: "",
    matricula: "",
    fax: "",
    sede_colegio: "",
};

const CreateAbogado = ({ onDone }: Props) => {
    const access = useAuthStore((s) => s.access_token) || "";
    const { setMessage, setShow, setType } = useNotificationsStore();
    const createAbogado = useCreateAbogado();

    const handleCreate = async (values: CreateUpdateAbogado) => {
        await createAbogado.mutateAsync(
            { access, abogado: values },
            {
                onSuccess: () => {
                    setMessage("Abogado creado correctamente");
                    setType("success");
                    setShow(true);
                    onDone?.();
                },
                onError: (error) => {
                    const backendMessage =
                        (error as any)?.response?.data?.detail ||
                        (error as any)?.response?.data?.message ||
                        "No se pudo crear el abogado";
                    setMessage(String(backendMessage));
                    setType("error");
                    setShow(true);
                },
            }
        );
    };

    return (
        <AbogadoForm
            initialValues={emptyValues}
            onSubmit={handleCreate}
            submitLabel="Crear abogado"
            loading={createAbogado.isPending}
        />
    );
};

export default CreateAbogado;
