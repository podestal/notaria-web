import APIClient from "./apiClient"

export interface Template {
    pktemplate: number;
    nametemplate: string;
    fktypekardex: number;
    codeacts: string;
    contract: string;
    urltemplate: string;
    filename: string;
    registrationdate: string;
    statusregister: number;
}

interface Props {
    by_actos?: boolean
}

const getTemplateService = ({ by_actos }: Props) => {
    let url = '/templates/'
    if (by_actos) {
        url = '/templates/by_actos/'
    }

    return new APIClient<Template>(url)
}

export default getTemplateService