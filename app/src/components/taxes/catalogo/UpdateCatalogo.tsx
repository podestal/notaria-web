import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useUpdateCatalog from "../../../hooks/taxes/useUpdateCatalog"
import type {
    Catalog,
    CreateUpdateCatalog,
} from "../../../services/taxes/catalogService"
import CatalogoForm from "./CatalogoForm"
import { catalogToFormValues, getCatalogBackendError } from "./catalogoFormShared"

interface Props {
    catalog: Catalog
    onCancel: () => void
}

const UpdateCatalogo = ({ catalog, onCancel }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const updateCatalog = useUpdateCatalog({ id_catalogo: catalog.id_catalogo })

    const handleUpdate = async (values: CreateUpdateCatalog) => {
        await updateCatalog.mutateAsync(
            { access, catalog: values },
            {
                onSuccess: () => {
                    setMessage("Ítem de catálogo actualizado correctamente")
                    setType("success")
                    setShow(true)
                    onCancel()
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
            catalog={catalog}
            initialValues={catalogToFormValues(catalog)}
            onSubmit={handleUpdate}
            submitLabel="Actualizar ítem"
            loading={updateCatalog.isPending}
            onCancel={onCancel}
        />
    )
}

export default UpdateCatalogo
