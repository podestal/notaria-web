import { UseMutationResult, useMutation, useQueryClient } from "@tanstack/react-query"
import getVehicleService, { Vehicle, CreateUpdateVEhicle } from "../../../services/api/vehicleService"

export interface UpdateVehicleData {
    access: string
    vehicle: CreateUpdateVEhicle
}

interface Props {
    vehicleId: number
    kardex: string
}

const useUpdateVehicular = ({ kardex, vehicleId }: Props): UseMutationResult<Vehicle, Error, UpdateVehicleData> => {
    const vehicleService = getVehicleService({ vehicleId })
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateVehicleData) => vehicleService.update(data.vehicle, data.access),
        onSuccess: (data) => {
            console.log('Vehicle updated successfully:', data);
            queryClient.invalidateQueries({ queryKey: ['vehiculares by kardex', kardex]  });
        },
        onError: (error) => {
            console.error("Error updating Vehicle:", error);
        }
    })
}
export default useUpdateVehicular;