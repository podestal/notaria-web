import PlantillaForm from "./PlantillaForm"

interface Props {
  onCreated?: () => void
  /** Si se define (p. ej. 100 extraprotocolares), el tipo de kardex queda fijo al crear. */
  lockedFktypekardex?: number
}

const CreatePlantilla = ({ onCreated, lockedFktypekardex }: Props) => {
  return <PlantillaForm onCreated={onCreated} lockedFktypekardex={lockedFktypekardex} />
}

export default CreatePlantilla
