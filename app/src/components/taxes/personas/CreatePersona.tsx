import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useCreatePersona from "../../../hooks/taxes/personas/useCreatePersona"
import type { CreateUpdatePersona, Persona } from "../../../services/taxes/personasService"
import PersonaForm from "./PersonaForm"
import {
    emptyPersonaFormValues,
    getPersonaBackendError,
    type PersonaFormValues,
} from "./personaFormShared"

interface Props {
    onDone?: () => void
    onCreated?: (persona: Persona) => void
    onCancel?: () => void
    initialValues?: PersonaFormValues
}

const CreatePersona = ({
    onDone,
    onCreated,
    onCancel,
    initialValues = emptyPersonaFormValues,
}: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const createPersona = useCreatePersona()

    const handleCreate = async (values: CreateUpdatePersona) => {
        try {
            const persona = await createPersona.mutateAsync({ access, persona: values })
            setMessage("Persona creada correctamente")
            setType("success")
            setShow(true)
            onCreated?.(persona)
            onDone?.()
        } catch (error) {
            setMessage(getPersonaBackendError(error))
            setType("error")
            setShow(true)
        }
    }

    return (
        <PersonaForm
            initialValues={initialValues}
            onSubmit={handleCreate}
            submitLabel="Crear persona"
            loading={createPersona.isPending}
            onCancel={onCancel}
        />
    )
}

export default CreatePersona
