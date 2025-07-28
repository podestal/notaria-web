import Participantes from "./Participantes"

interface Props {
    viajeId: number;
}

const ParticipantesMain = ({ viajeId }: Props) => {
  return (
        <div className="grid grid-cols-4 gap-4 my-4">
            <Participantes viajeId={viajeId} />
            <div className="col-span-3 bg-slate-100 p-4 rounded-lg">
                <h2 className="text-md font-semibold text-blue-900">Informacion de Ingreso de Participantes..!</h2>
                <p className="text-xs">1.- Al ingresar a los participantes, primero debe ingresar AL PADRE y/o a LA MADRE.</p>
                <p className="text-xs">2.- Luego ingresar al APODERADO si fuera el caso</p>
                <p className="text-xs">3.- finalmente agregar al HIJO o HIJOS</p>
            </div>
        </div>
  )
}

export default ParticipantesMain