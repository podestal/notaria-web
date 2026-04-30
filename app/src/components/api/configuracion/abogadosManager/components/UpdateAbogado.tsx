import { Abogado, CreateUpdateAbogado } from "../../../../../services/api/abogadosService";
import useAuthStore from "../../../../../store/useAuthStore";
import useNotificationsStore from "../../../../../hooks/store/useNotificationsStore";
import useUpdateAbogado from "../../../../../hooks/api/abogados/useUpdateAbogado";
import AbogadoForm, { AbogadoFormValues } from "./AbogadoForm";

interface Props {
    abogado: Abogado;
    onCancel: () => void;
}

const toFormValues = (abogado: Abogado): AbogadoFormValues => ({
    razonsocial: abogado.razonsocial ?? "",
    direccion: abogado.direccion ?? "",
    distrito: abogado.distrito ?? "",
    documento: abogado.documento ?? "",
    telefono: abogado.telefono ?? "",
    matricula: abogado.matricula ?? "",
    fax: abogado.fax ?? "",
    sede_colegio: abogado.sede_colegio ?? "",
});

const UpdateAbogado = ({ abogado, onCancel }: Props) => {
    const access = useAuthStore((s) => s.access_token) || "";
    const { setMessage, setShow, setType } = useNotificationsStore();
    const updateAbogado = useUpdateAbogado({ idabogado: abogado.idabogado });

    const handleUpdate = async (values: CreateUpdateAbogado) => {
        await updateAbogado.mutateAsync(
            { access, abogado: values },
            {
                onSuccess: () => {
                    setMessage("Abogado actualizado correctamente");
                    setType("success");
                    setShow(true);
                    onCancel();
                },
                onError: (error) => {
                    const backendMessage =
                        (error as any)?.response?.data?.detail ||
                        (error as any)?.response?.data?.message ||
                        "No se pudo actualizar el abogado";
                    setMessage(String(backendMessage));
                    setType("error");
                    setShow(true);
                },
            }
        );
    };

    return (
        <AbogadoForm
            initialValues={toFormValues(abogado)}
            onSubmit={handleUpdate}
            submitLabel="Actualizar abogado"
            loading={updateAbogado.isPending}
            onCancel={onCancel}
        />
    );
};

export default UpdateAbogado;
