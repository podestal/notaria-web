import useAuthStore from "../../../store/useAuthStore"
import useNotificationsStore from "../../../hooks/store/useNotificationsStore"
import useUpdatePersona from "../../../hooks/taxes/personas/useUpdatePersona"
import type { CreateUpdatePersona, Persona } from "../../../services/taxes/personasService"
import PersonaForm from "./PersonaForm"
import { getPersonaBackendError, personaToFormValues } from "./personaFormShared"

interface Props {
    persona: Persona
    onCancel: () => void
}

const UpdatePersona = ({ persona, onCancel }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ""
    const { setMessage, setShow, setType } = useNotificationsStore()
    const updatePersona = useUpdatePersona({ id_persona: persona.id_persona })

    const handleUpdate = async (values: CreateUpdatePersona) => {
        await updatePersona.mutateAsync(
            { access, persona: values },
            {
                onSuccess: () => {
                    setMessage("Persona actualizada correctamente")
                    setType("success")
                    setShow(true)
                    onCancel()
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
            initialValues={personaToFormValues(persona)}
            onSubmit={handleUpdate}
            submitLabel="Actualizar persona"
            loading={updatePersona.isPending}
            onCancel={onCancel}
        />
    )
}

export default UpdatePersona
