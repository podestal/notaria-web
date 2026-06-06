import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreateCatalog from "../../../hooks/taxes/useCreateCatalog"
import type { CreateUpdateCatalog } from "../../../services/taxes/catalogService"
import CatalogoForm from "./CatalogoForm"
import { emptyCatalogoFormValues, getCatalogBackendError } from "./catalogoFormShared"

interface Props {
    onDone?: () => void
}

const CreateCatalogo = ({ onDone }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createCatalog = useCreateCatalog()

    const handleCreate = async (values: CreateUpdateCatalog) => {
        await createCatalog.mutateAsync(
            { access, catalog: values },
            {
                onSuccess: () => {
                    setMessage("Ítem de catálogo creado correctamente")
                    setType("success")
                    setShow(true)
                    onDone?.()
                },
                onError: (error) => {
                    setMessage(getCatalogBackendError(error))
                    setType("error")
                    setShow(true)
                },
            },
        )
    }

    return (
        <CatalogoForm
            initialValues={emptyCatalogoFormValues}
            onSubmit={handleCreate}
            submitLabel="Crear ítem"
            loading={createCatalog.isPending}
        />
    )
}

export default CreateCatalogo
