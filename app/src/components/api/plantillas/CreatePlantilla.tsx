import PlantillaForm from "./PlantillaForm"

interface Props {
  onCreated?: () => void
}

const CreatePlantilla = ({ onCreated }: Props) => {
  return <PlantillaForm onCreated={onCreated} />
}

export default CreatePlantilla
