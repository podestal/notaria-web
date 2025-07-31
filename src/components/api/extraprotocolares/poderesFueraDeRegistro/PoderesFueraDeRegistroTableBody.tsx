import { IngresoPoderesPage } from "../../../../services/api/extraprotocolares/ingresoPoderes"
import PoderesFueraDeRegistroCard from "./PoderesFueraDeRegistroCard"

interface Props {
    poderes: IngresoPoderesPage | undefined
}


const PoderesFueraDeRegistroTableBody = ({ poderes }: Props) => {

  return (
    <>
        {poderes && poderes.results.length > 0 ?
        <>
            {poderes.results.map((poder) => (
                <PoderesFueraDeRegistroCard key={poder.id_poder} poder={poder} />
            ))}
        </>
        :
        <p className="col-span-8 text-center my-4 text-xs">No hay registros</p>
        }
    </>
  )
}

export default PoderesFueraDeRegistroTableBody