import { useMutation, UseMutationResult, useQueryClient } from "@tanstack/react-query";
import getTemplateService, { Template } from "../../../services/api/templatesService";

export interface DeleteTemplateData {
    access: string;
}

interface Props {
    pktemplate: number;
}

const useDeleteTemplate = ({ pktemplate }: Props): UseMutationResult<Template, Error, DeleteTemplateData> => {
    const queryClient = useQueryClient();
    const templateService = getTemplateService({ pktemplate });

    return useMutation({
        mutationFn: ({ access }: DeleteTemplateData) => templateService.delete(access),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] });
        },
        onError: (error) => {
            console.error("Error deleting template:", error);
        },
    });
};

export default useDeleteTemplate;
