import { DetalleBien } from "../../../services/api/detalleBienService"
import RemoveDetalleBien from "./RemoveDetalleBien"
import UpdateDetalleBien from "./UpdateDetalleBien"

interface Props {
    detalleBien: DetalleBien
}

const DetalleBienCard = ({ detalleBien }: Props) => {
  return (
    <div className="grid grid-cols-6 gap-4 p-2 items-center my-2">
        <p className="text-xs">{detalleBien.kardex}</p>
        <p className="text-xs">{detalleBien.idtipacto}</p>
        <p className="text-xs">{detalleBien.tipob}</p>
        <p className="text-xs">{detalleBien.idtipbien}</p>
        <p className="text-xs">{detalleBien.fechaconst}</p>
        <div className="flex justify-end space-x-2">
            <RemoveDetalleBien 
                detalleBien={detalleBien}
            />
            <div>|</div>
            <UpdateDetalleBien 
                detalleBien={detalleBien}
            />
        </div>
    </div>
  )
}

export default DetalleBienCard