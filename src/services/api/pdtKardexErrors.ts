import APIClient from "./apiClient"

export interface PdtError {
    kardex: string;
    idKardex: number;
    errorItem: string;
    act: string;
    fileType: string;
    isCorrectable: number;
    typeOfCorrection: string;
    categoryCorrect: string;
    writingDate: string | null;
    idContractor: number | null;
    itemMp: number | null;
    typeAct: string;
}

export interface PdtPage {
    count: number;
    next: string | null;
    previous: string | null;
    results: PdtError[];
    summary: {
        total_kardex: number;
        total_errors: number;
        error_breakdown: {
            [key: string]: number;
        };
    };
}

interface Props {
    forEscritura?: boolean;
    forVehicular?: boolean;
    forGarantias?: boolean;
}

const getPdtKardexErrorsService = ({ forEscritura, forVehicular, forGarantias }: Props) => {
    let url = 'kardex'
    if (forEscritura) {
        url += '/pdt-escrituras/'
    }
    if (forVehicular) {
        url += '/pdt-vehiculares/'
    }
    if (forGarantias) {
        url += '/pdt-garantias/'
    }
    return new APIClient<PdtPage>(url)
}

export default getPdtKardexErrorsService