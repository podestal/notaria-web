import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query"
import getVehicleService, { Vehicle } from "../../../services/api/vehicleService"

export interface RemoveVehicularData {
    access: string;
}

interface Props {
    idVehicular: number;
    kardex: string;
}

const useRemoveVehicular = ({ idVehicular, kardex }: Props): UseMutationResult<Vehicle, Error, RemoveVehicularData> => {
    const queryClient = useQueryClient();
    const vehicleService = getVehicleService({ vehicleId: idVehicular });

    return useMutation({
        mutationFn: (data: RemoveVehicularData) => vehicleService.delete(data.access),
        onSuccess: (data) => {
            console.log('Vehicle removed successfully:', data);
            queryClient.invalidateQueries({ queryKey:['vehiculares by kardex', kardex] });
        },
        onError: (error) => {
            console.error("Error removing Vehicle:", error);
        }
    });
};

export default useRemoveVehicular;