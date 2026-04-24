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

    const handleDownloadUpdatedDocument = async () => {
        const mode = 'download';
        const response = await axios.get(
            `${docsURL}documentos/open-document/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}&mode=${mode}`,
            {
                responseType: 'blob',
                headers: {
                    'Authorization': `JWT ${access}`,
                }
            }
        );

        const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        });
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `__PROY__${kardex.kardex}.docx`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    };

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
        ).then(async () => {
                setType('success');
                setMessage('Documento actualizado correctamente');
                setShow(true);
                try {
                    await handleDownloadUpdatedDocument();
                } catch (downloadError) {
                    console.error('Error al descargar el documento actualizado:', downloadError);
                }
            }).catch((error) => {
                console.error('Error al actualizar el documento:', error);
                setType('error');
                const backendMessage =
                    error?.response?.data?.message ||
                    error?.response?.data?.detail ||
                    error?.message ||
                    'Error al actualizar el documento';
                setMessage(backendMessage);
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