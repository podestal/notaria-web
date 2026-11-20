import axios from "axios";
import useAuthStore from "../../../../store/useAuthStore";
import useNotificationsStore from "../../../../hooks/store/useNotificationsStore";
import { FileCog, Loader2 } from "lucide-react";
import { useState } from "react";
import ExplanationMessage from "../../../ui/ExplanationMessage";
import TopModal from "../../../ui/TopModal";

interface Props {
    name: string
    url: string
    params: Record<string, string>
}

const GenerarDocumento = ({ name, url, params }: Props) => {
    const [isLoading, setIsLoading] = useState(false);
    const access = useAuthStore((s) => s.access_token) || ''
    const { setType, setMessage, setShow } = useNotificationsStore();
    const docsURL = import.meta.env.VITE_DOC_URL

    const [openExplanation, setOpenExplanation] = useState(false)
    const [explanationMessage, setExplanationMessage] = useState('')

    const showNotification = (type: 'success' | 'error', message: string) => {
        setType(type);
        setMessage(message);
        setShow(true);
    };

    const handleOpenDocument = async () => {
        if (isLoading) return; // Prevent multiple clicks during loading
        
        setIsLoading(true);
        
        try {
          const mode = 'download';

          const response = await axios.get(
            `${docsURL}extraprotocolares/${url}/`,
            {
              responseType: 'blob',
              headers: {
                'Authorization': `JWT ${access}`,
              },
              params: {
                mode,
                ...params
              }
            }
          );

          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          });
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;

          link.download = name;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
          showNotification('success', 'Documento descargado exitosamente');

        } catch (error) {
          const status = (error as any)?.status ?? (error as any)?.response?.status;
        
          if (status === 404) {
              setOpenExplanation(true);
              setExplanationMessage('El documento no ha sido creado, por favor, genere el documento y vuelva a intentarlo.')
          } else if (status === 409) {
              setOpenExplanation(true);
              setExplanationMessage('El documento ya ha sido creado, por favor, pruebe con ver el documento.')
          }
        } finally {
          setIsLoading(false);
        }
      };

  return (
    <>
    <button
        type="button"
        onClick={handleOpenDocument}
        disabled={isLoading}
        className={`inline-flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-semibold text-white shadow-sm transition ${
            isLoading
                ? "cursor-not-allowed bg-emerald-600/60"
                : "cursor-pointer bg-emerald-600 hover:bg-emerald-500"
        }`}
    >
        {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
        ) : (
            <FileCog className="h-4 w-4" aria-hidden />
        )}
        <span>{isLoading ? "Generando…" : "Generar"}</span>
    </button>
      <TopModal
        isOpen={openExplanation}
        onClose={() => setOpenExplanation(false)}
    >
        <ExplanationMessage
            onClick={() => setOpenExplanation(false)}
            message={explanationMessage}
        />
    </TopModal>
    </>
  )
}

export default GenerarDocumento