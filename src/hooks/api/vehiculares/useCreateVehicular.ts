import { useMutation, UseMutationResult } from "@tanstack/react-query"
import getVehicleService, { Vehicle, CreateUpdateVEhicle } from "../../../services/api/vehicleService"

export interface CreateVehicularData {
    vehicle: CreateUpdateVEhicle;
    access: string;
}

const useCreateVehicular = (): UseMutationResult<Vehicle, Error, CreateVehicularData> => {
    const vehicleService = getVehicleService({})

    return useMutation({
        mutationFn: (data: CreateVehicularData) => vehicleService.post(data.vehicle, data.access),
        onSuccess: (data) => {
            console.log('Vehicle created successfully:', data);
        },
        onError: (error) => {
            console.error("Error creating Vehicle:", error);
        }
    })
}

export default useCreateVehicular;