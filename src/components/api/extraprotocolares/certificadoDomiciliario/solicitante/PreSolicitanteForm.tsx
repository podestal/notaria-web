import { useState } from "react";
import { documentNaturalOptions } from "../../../../../data/clienteData";
import SimpleSelector from "../../../../ui/SimpleSelector";
import SimpleInput from "../../../../ui/SimpleInput";
import axios from "axios";

interface Props {
    setSolicitante: React.Dispatch<React.SetStateAction<string>>;
    setDomicilio: React.Dispatch<React.SetStateAction<string>>;
    setDistrito: React.Dispatch<React.SetStateAction<string>>;
    setProfesion: React.Dispatch<React.SetStateAction<string>>;
    setEstadoCivil: React.Dispatch<React.SetStateAction<string>>;
    setGenero: React.Dispatch<React.SetStateAction<string>>;
    setShowSolicitanteForm: React.Dispatch<React.SetStateAction<boolean>>;
}


const PreSolicitanteForm = ({setSolicitante, setDomicilio, setDistrito, setProfesion, setEstadoCivil, setGenero, setShowSolicitanteForm}: Props) => {


    const [selectedTipoDocumento, setSelectedTipoDocumento] = useState(1);
    const [document, setDocument] = useState('');
    const [loading, setLoading] = useState(false);

    const handleClienteLookup = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        // Simulate an API call
        axios.get(
            `${import.meta.env.VITE_API_URL}cliente/by_dni/?dni=${document}`
        ).then(response => {
            if (response.data.idcliente) {
                console.log('Cliente encontrado:', response.data);
                setSolicitante(response.data.nombre);
                setDomicilio(response.data.direccion);
                setDistrito(response.data.idubigeo);
                setProfesion(response.data.idprofesion);
                setEstadoCivil(response.data.idestcivil.toString());
                setGenero(response.data.sexo);
                setShowSolicitanteForm(true);
            } else {
                console.log('Cliente no encontrado, creando nuevo cliente')
                setShowSolicitanteForm(false);
            }
        }).catch(error => {
            console.log('Error al buscar el cliente:', error);
            console.error(error);
        }).finally(() => {
            setLoading(false)
        })

    }
  return (
    <form 
        className="w-full"
        onSubmit={handleClienteLookup}
    >
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelector 
                label="Tipo de documento"
                options={documentNaturalOptions}
                setter={setSelectedTipoDocumento}
                defaultValue={selectedTipoDocumento}
            />
            <SimpleInput
                label="Número de documento"
                value={document}
                setValue={setDocument}
                horizontal
            />
        </div>
    </form>
  )
}

export default PreSolicitanteForm