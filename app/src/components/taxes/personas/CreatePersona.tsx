import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreatePersona from "../../../hooks/taxes/personas/useCreatePersona"
import type { CreateUpdatePersona } from "../../../services/taxes/personasService"
import PersonaForm from "./PersonaForm"
import { emptyPersonaFormValues, getPersonaBackendError } from "./personaFormShared"

interface Props {
    onDone?: () => void
}

const CreatePersona = ({ onDone }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createPersona = useCreatePersona()

    const handleCreate = async (values: CreateUpdatePersona) => {
        await createPersona.mutateAsync(
            { access, persona: values },
            {
                onSuccess: () => {
                    setMessage("Persona creada correctamente")
                    setType("success")
                    setShow(true)
                    onDone?.()
                },
                onError: (error) => {
                    setMessage(getPersonaBackendError(error))
                    setType("error")
                    setShow(true)
                },
            },
        )
    }

    return (
        <PersonaForm
            initialValues={emptyPersonaFormValues}
            onSubmit={handleCreate}
            submitLabel="Crear persona"
            loading={createPersona.isPending}
        />
    )
}

export default CreatePersona
