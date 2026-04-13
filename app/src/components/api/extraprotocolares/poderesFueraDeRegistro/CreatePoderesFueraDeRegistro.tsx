import useCreateIngresoPoderes from "../../../../hooks/api/extraprotocolares/ingresoPoderes/useCreateIngresoPoderes"
import PoderesFueraDeRegistroForm from "./PoderesFueraDeRegistroForm"

interface Props {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreatePoderesFueraDeRegistro = ({ setOpen }: Props) => {

    const createIngresoPoderes = useCreateIngresoPoderes()

  return (
    <PoderesFueraDeRegistroForm 
        createIngresoPoderes={createIngresoPoderes}
        setOpen={setOpen}
    />
  )
}

export default CreatePoderesFueraDeRegistro