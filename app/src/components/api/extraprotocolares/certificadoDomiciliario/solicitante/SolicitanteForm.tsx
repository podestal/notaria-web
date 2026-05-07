import type { Dispatch, SetStateAction } from "react";
import { Nacionalidad } from "../../../../../services/api/nacionalidadesService";
import { Ubigeo } from "../../../../../services/api/ubigeoService";
import { Profesion } from "../../../../../services/api/profesionesService";
import SimpleInput from "../../../../ui/SimpleInput";
import { ESTADO_CIVIL } from "../../../../../data/clienteData";
import { mapToGeneroMF } from "./generoUtils";

interface Props {
    solicitante: string;
    setSolicitante: Dispatch<SetStateAction<string>>;
    domicilio: string;
    setDomicilio: Dispatch<SetStateAction<string>>;
    distrito: string | number | null | undefined;
    setDistrito: Dispatch<SetStateAction<string>>;
    estadoCivil: number;
    setEstadoCivil: Dispatch<SetStateAction<number>>;
    genero: string | number | null | undefined;
    setGenero: Dispatch<SetStateAction<string>>;
    ubigeos: Ubigeo[];
    nacionalidades: Nacionalidad[];
    profesiones: Profesion[];
    profesion: string | number | null | undefined;
    setProfesion: Dispatch<SetStateAction<string>>;
}

const toSafeString = (value: unknown): string => {
    if (value == null) return "";
    if (typeof value === "string") return value;
    if (typeof value === "number") return String(value);
    if (typeof value === "object" && "label" in (value as Record<string, unknown>)) {
        const label = (value as Record<string, unknown>).label;
        return label == null ? "" : String(label);
    }
    return String(value);
};

const resolveProfesionLabel = (value: unknown, profesiones: Profesion[]): string => {
    const raw = toSafeString(value).trim();
    if (!raw) return "";
    const byId = profesiones.find((p) => p.idprofesion === Number(raw));
    return byId?.desprofesion || raw;
};

const SolicitanteForm = ({
    solicitante,
    domicilio,
    distrito,
    estadoCivil,
    genero,
    ubigeos,
    profesiones,
    profesion,
}: Props) => {
    const noop = () => {};
    const distritoStr = toSafeString(distrito);
    const profesionStr = toSafeString(profesion);
    const generoStr = toSafeString(genero);
    const ubigeoMatch = ubigeos.find((u) => u.coddis === distritoStr);
    const ubigeoLabel = ubigeoMatch
        ? `${ubigeoMatch.nomdpto} - ${ubigeoMatch.nomprov} - ${ubigeoMatch.nomdis}`
        : distritoStr;
    const profesionLabel = resolveProfesionLabel(profesionStr, profesiones);
    const estadoCivilLabel =
        ESTADO_CIVIL.find((estado) => estado.value === Number(estadoCivil))?.desestcivil || "";
    const generoMf = mapToGeneroMF(generoStr);
    const generoLabel = generoMf === "M" ? "Masculino" : generoMf === "F" ? "Femenino" : "";

    return (
        <div className="w-[80%] flex justify-center items-start flex-col gap-4 my-4">
            <SimpleInput label="Solicitante" value={solicitante} setValue={noop} horizontal fullWidth disabled />
            <SimpleInput label="Domicilio" value={domicilio} setValue={noop} horizontal fullWidth disabled />
            <SimpleInput label="Ubigeo" value={ubigeoLabel} setValue={noop} horizontal fullWidth disabled />
            <SimpleInput label="Profesión" value={profesionLabel} setValue={noop} horizontal fullWidth disabled />
            <SimpleInput label="Estado Civil" value={estadoCivilLabel} setValue={noop} horizontal fullWidth disabled />
            <SimpleInput label="Género" value={generoLabel} setValue={noop} horizontal fullWidth disabled />
        </div>
    );
};

export default SolicitanteForm;
