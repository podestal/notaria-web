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

export interface TemplatePage {
    count: number
    next: string | null
    previous: string | null
    results: Template[]
}


interface Props {
    pktemplate?: number
    by_actos?: boolean
}

const getTemplateService = ({ by_actos, pktemplate }: Props) => {
    let url = '/templates/'
    if (pktemplate) {
        url = `/templates/${pktemplate}/`
    }
    if (by_actos) {
        url = '/templates/by_actos/'
    }

    return new APIClient<Template>(url)
}

export const getTemplatePageService = () => {
    return new APIClient<TemplatePage>('/templates/')
}

export default getTemplateService