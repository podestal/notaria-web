import APIClient from "./apiClient"

// "pktemplate": 1,
// "nametemplate": "TRANSFERENCIA VEHICULAR DE PERSONA NATURAL A NATURAL BASE",
// "fktypekardex": 3,
// "codeacts": "094",
// "contract": "COMPRA VENTA DE VEHICULO AUTOMOTOR /",
// "urltemplate": "",
// "filename": "TRANSFERENCIA VEHICULAR DE PERSONA NATURAL A NATURAL BASE.docx",
// "registrationdate": "2020-09-16T13:42:14Z",
// "statusregister": 0

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