import axios from "axios";
import { Kardex } from "../../../services/api/kardexService";
import useAuthStore from "../../../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import ExplanationMessage from "../../ui/ExplanationMessage";
import { useState } from "react";
import TopModal from "../../ui/TopModal";
import { Loader } from "lucide-react";

interface Props {
  kardex: Kardex
}

const CreateDocumento = ({ kardex }: Props) => {

    const docsURL = import.meta.env.VITE_DOC_URL
    const access = useAuthStore((s) => s.access_token) || ''
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    
    const handleOpenDocument = async () => {
      if (kardex.fktemplate === 0) {
        setOpen(true);
        return;
      }

      try {
        const mode = 'download';
        setLoading(true)

        // Force download on every OS to avoid Windows auto-open issues.
        const response = await axios.get(
          `${docsURL}documentos/open-template/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}&mode=${mode}`,
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

      } catch (error) {
        console.error('Error opening Word document:', error);
      } finally {
        queryClient.invalidateQueries({ queryKey: ["documents by kardex", `${kardex.kardex}`] })
        setLoading(false)
      }
    };

  return (
  <>
      <button
        onClick={handleOpenDocument}
        className="mt-8 bg-red-600 text-white flex items-center justify-center gap-2 px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 text-xs cursor-pointer"
      >
        {loading ? <Loader className="animate-spin w-20 h-4" /> : 'Generar Proyecto'}
      </button>
      <TopModal
        isOpen={open}
        onClose={() => setOpen(false)}
      >
        <ExplanationMessage
          message="Este kardex no cuenta con una plantilla asignada, por favor asigne una plantilla para generar el proyecto."
          onClick={() => setOpen(false)}
        />
      </TopModal>
    </>
  );
};

export default CreateDocumento;
