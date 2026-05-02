import { useEffect, useState } from "react";
import { Nacionalidad } from "../../../../../services/api/nacionalidadesService";
import { Ubigeo } from "../../../../../services/api/ubigeoService";
import SimpleInput from "../../../../ui/SimpleInput";
import { ESTADO_CIVIL } from "../../../../../data/clienteData";
import SimpleSelector from "../../../../ui/SimpleSelector";
import SearchableDropdownInput from "../../../../ui/SearchableDropdownInput";
import { Profesion } from "../../../../../services/api/profesionesService";
import { mapToGeneroMF } from "./generoUtils";

interface Props {
    solicitante: string;
    setSolicitante: React.Dispatch<React.SetStateAction<string>>;
    domicilio: string;
    setDomicilio: React.Dispatch<React.SetStateAction<string>>;
    distrito: string;
    setDistrito: React.Dispatch<React.SetStateAction<string>>;
    estadoCivil: number;
    setEstadoCivil: React.Dispatch<React.SetStateAction<number>>;
    genero: string;
    setGenero: React.Dispatch<React.SetStateAction<string>>;
    ubigeos: Ubigeo[];
    nacionalidades: Nacionalidad[];
    profesiones: Profesion[];
    profesion: string;
    setProfesion: React.Dispatch<React.SetStateAction<string>>;
}
const SolicitanteForm = ({solicitante, setSolicitante, domicilio, setDomicilio, distrito, setDistrito, estadoCivil, setEstadoCivil, genero, setGenero, ubigeos, profesiones, profesion, setProfesion}: Props) => {

    // Keep a local selected option for the Ubigeo dropdown
    const [ubigeo, setUbigeo] = useState<{ id: string; label: string } | null>(() => {
        if (distrito) {
          const match = ubigeos.find(ubi => ubi.coddis === distrito);
          if (match) {
            return {
              id: match.coddis,
              label: `${match.nomdpto} - ${match.nomprov} - ${match.nomdis}`,
            };
          }
        }
        return null;
      });

    const [selectedProfesion, setSelectedProfesion] = useState<{id: string, label: string} | null>(() => {
        if (profesion) {
            const match = profesiones.find(prof => prof.idprofesion === parseInt(profesion));
            if (match) {
                return { id: match.idprofesion.toString(), label: match.desprofesion };
            }
        }
        return null;
    });

    // Local numeric state for Estado Civil, mapped to the prop (coerce to number)
    const [estadoCivilValue, setEstadoCivilValue] = useState<number>(() => {
        const coerced = Number(estadoCivil);
        return Number.isFinite(coerced) ? coerced : 0;
    });

    // Reflect prop changes (e.g., after DNI lookup) into local selector value (coerce to number)
    useEffect(() => {
        const coerced = Number(estadoCivil);
        setEstadoCivilValue(Number.isFinite(coerced) ? coerced : 0);
    }, [estadoCivil]);

    // When distrito or ubigeos change (e.g., after fetch), sync the local selected Ubigeo option
    useEffect(() => {
        if (distrito) {
            const match = ubigeos.find(ubi => ubi.coddis === distrito);
            if (match) {
                setUbigeo({ id: match.coddis, label: `${match.nomdpto} - ${match.nomprov} - ${match.nomdis}` });
                return;
            }
        }
        setUbigeo(null);
    }, [distrito, ubigeos]);

    useEffect(() => {
        if (selectedProfesion) {
            setProfesion(selectedProfesion.label);
        }
    }, [selectedProfesion, profesion]);

    // Whenever user selects an Ubigeo option, propagate coddis to parent distrito
    useEffect(() => {
        setDistrito(ubigeo?.id || '');
    }, [ubigeo, setDistrito]);
    
  return (
    <div className="w-[80%] flex justify-center items-start flex-col gap-4 my-4">
        <SimpleInput 
            label="Solicitante"
            value={solicitante}
            setValue={setSolicitante}
            horizontal
            fullWidth
        />
        <SimpleInput 
            label="Domicilio"
            value={domicilio}
            setValue={setDomicilio}
            horizontal
            fullWidth
        />
        <div className="w-full flex justify-center items-center gap-4 col-span-2">
            <p className="pl-2 block text-xs font-semibold text-slate-700">Ubigeo</p>
            <SearchableDropdownInput
                options={[...ubigeos.map(ubi => ({ id: ubi.coddis, label: `${ubi.nomdpto} - ${ubi.nomprov} - ${ubi.nomdis}` }))]}
                selected={ubigeo}
                setSelected={setUbigeo}
                placeholder="Buscar Ubigeo"
            />
        </div>
        <div className="w-full flex justify-center items-center gap-4 col-span-2">
            <p className="pl-2 block text-xs font-semibold text-slate-700">Profesión</p>
            <SearchableDropdownInput
                options={[...profesiones.map(prof => ({ id: prof.idprofesion.toString(), label: prof.desprofesion }))]}
                selected={selectedProfesion}
                setSelected={setSelectedProfesion}
                placeholder="Buscar Profesión"
            />
        </div>
        <SimpleSelector
            label="Estado Civil"
            options={[{label: 'Seleccione una opción', value: 0}, ...ESTADO_CIVIL.map(estado => ({
                label: estado.desestcivil,
                value: estado.value
            }))]}
            setter={(value: number) => {
                setEstadoCivilValue(value);
                setEstadoCivil(Number(value));
            }}
            defaultValue={estadoCivilValue}
        />
        <div className="grid grid-cols-3 items-center gap-2 w-full">
            <p className="pl-2 block text-xs font-semibold text-slate-700">Género</p>
            <div className="flex items-center gap-1 w-full col-span-2">
                <select
                    className="flex-1 bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300"
                    value={mapToGeneroMF(genero)}
                    onChange={(e) => setGenero(e.target.value)}
                >
                    <option value="">Seleccionar género</option>
                    <option value="M">Masculino</option>
                    <option value="F">Femenino</option>
                </select>
            </div>
        </div>
    </div>
  )
}

export default SolicitanteForm