import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getVehicleService, { Vehicle, CreateUpdateVEhicle } from "../../../services/api/vehicleService"

export interface CreateVehicularData {
    vehicle: CreateUpdateVEhicle;
    access: string;
}

interface Props {
    kardex: string
}

const useCreateVehicular = ({ kardex }: Props): UseMutationResult<Vehicle, Error, CreateVehicularData> => {
    const vehicleService = getVehicleService({})
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreateVehicularData) => vehicleService.post(data.vehicle, data.access),
        onSuccess: (data) => {
            console.log('Vehicle created successfully:', data);
            queryClient.invalidateQueries({ queryKey:['vehiculares by kardex', kardex] });
        },
        onError: (error) => {
            console.error("Error creating Vehicle:", error);
        }
    })
}

export default useCreateVehicular;