import { UseQueryResult, useQuery } from "@tanstack/react-query"
import getVehicleService, {Vehicle} from "../../../services/api/vehicleService"

interface Props {
    access: string
    kardex: string
}

const useGetVehicularesByKardex = ({ access, kardex }: Props): UseQueryResult<Vehicle[], Error> => {
    const vehicleService = getVehicleService({ byKardex: true })
    const params = {kardex}

    return useQuery({
        queryKey: ['vehiculares by kardex', kardex],
        queryFn: () => vehicleService.get(access, params),
    })
}

export default useGetVehicularesByKardex