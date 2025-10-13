import axios from "axios";
import { Kardex } from "../../../services/api/kardexService"
import { useState } from "react";
import { Loader2 } from "lucide-react";
import useNotificationsStore from "../../../hooks/store/useNotificationsStore";
import useAuthStore from "../../../store/useAuthStore";

interface Props {
    kardex: Kardex
}

const UpdateDocumento = ({ kardex }: Props) => {

    console.log('UpdateDocumento', kardex);
    const docsURL = import.meta.env.VITE_DOC_URL
    const [isLoading, setIsLoading] = useState(false);
    const { setMessage, setShow, setType } = useNotificationsStore();
    const access = useAuthStore((s) => s.access_token) || ''

    const handleUpdate = () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append('template_id', kardex.fktemplate.toString());
        formData.append('kardex', kardex.kardex);
        console.log('formData', formData);
        axios.post(
        `${docsURL}update-docx/`,
        formData,
        {
            headers: {
                'Authorization': `JWT ${access}`,
            }
        }
        ).then(() => {
                setType('success');
                setMessage('Documento actualizado correctamente');
                setShow(true);
            }).catch((error) => {
                console.error('Error al actualizar el documento:', error);
                setType('error');
                setMessage(error.response.data.message);
                setShow(true);
            }).finally(() => {
                setIsLoading(false);
            });
    }
    

  return (
    <button 
        className={`mt-8 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300 text-xs cursor-pointer ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
        disabled={isLoading}
        onClick={handleUpdate}
    >{isLoading ? <Loader2 className="animate-spin w-20 h-4" /> : 'Actualizar Proyecto'}</button>
  )
}

export default UpdateDocumento