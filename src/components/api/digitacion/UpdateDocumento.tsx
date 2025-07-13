import axios from "axios";
import { Kardex } from "../../../services/api/kardexService"

interface Props {
    kardex: Kardex
}

const UpdateDocumento = ({ kardex }: Props) => {

    console.log('UpdateDocumento', kardex);

    const handleUpdate = () => {
        const formData = new FormData();
        formData.append('template_id', kardex.fktemplate.toString());
        formData.append('kardex', kardex.kardex);

        axios.post(
        'http://127.0.0.1:8001/docs/update-docx/',
        formData
        ).then((response) => {
                console.log('Documento actualizado', response.data);
                // Aquí puedes manejar la respuesta, como mostrar un mensaje de éxito
            }).catch((error) => {
                console.error('Error al actualizar el documento:', error);
                // Aquí puedes manejar el error, como mostrar un mensaje de error
            })
        // axios.post(
        //     `http://127.0.0.1:8001/docs/update-docx/?kardex=${kardex.kardex}&template_id=${kardex.fktemplate}`,{
        //         template_id: '1',
        //         kardex: 'ACT401-2025'
        //     });
    }
    

  return (
    <button 
        className="mt-8 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 text-xs cursor-pointer"
        onClick={handleUpdate}
    >Actualizar Proyecto</button>
  )
}

export default UpdateDocumento