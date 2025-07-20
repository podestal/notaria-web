import { DetalleBien } from "../../../services/api/detalleBienService"

interface Props {
    detalleBien: DetalleBien
}

const DetalleBienCard = ({ detalleBien }: Props) => {
  return (
    <div className="grid grid-cols-6 gap-4 p-2">
        <p className="text-xs">{detalleBien.kardex}</p>
        <p className="text-xs">{detalleBien.idtipacto}</p>
        <p className="text-xs">{detalleBien.tipob}</p>
        <p className="text-xs">{detalleBien.idtipbien}</p>
        <p className="text-xs">{detalleBien.fechaconst}</p>
    </div>
  )
}

export default DetalleBienCard