import { useMutation, UseMutationResult } from "@tanstack/react-query";
import processDocumentService, { SisgenRequest, SisgenResponse } from "../../services/sisgen/processDocumentService";

interface SisgenRequestData {
    access: string;
    data: SisgenRequest;
}

const useProcessDocument = (): UseMutationResult<SisgenResponse, Error, SisgenRequestData> => {
    return useMutation({
        mutationFn: (data: SisgenRequestData) => processDocumentService.post(data.data, data.access),
        onSuccess: (data) => {
            console.log(data);
        },
        onError: (error) => {
            console.log(error);
        }
    })
}

export default useProcessDocument;