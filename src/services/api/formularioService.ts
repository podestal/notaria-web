import APIClient from "./apiClient";

// "idformulario": 1,
//             "idrenta": "000007",
//             "numformu": "763431826",
//             "monto": "500"

export interface Formulario {
    idformulario: number;
    idrenta: string;
    numformu: string;
    monto: string;
}

export type CreateUpdateFormulario = Omit<Formulario, 'idformulario'>;

interface Props {
    byRenta?: boolean
    id?: number
}

const getFormularioService = ({ byRenta, id }: Props) => {
    let url = 'formulario/'
    if (byRenta) {
        url += 'by_renta/'
    }
    if (id) {
        url += `${id}/`
    }
    return new APIClient<Formulario, CreateUpdateFormulario>(url)
}

export default getFormularioService