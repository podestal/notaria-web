import axios from "axios";
import { Kardex } from "../../../services/api/kardexService";
import useAuthStore from "../../../store/useAuthStore";
import { useQueryClient } from "@tanstack/react-query";
import ExplanationMessage from "../../ui/ExplanationMessage";
import { useState } from "react";
import TopModal from "../../ui/TopModal";

interface Props {
  kardex: Kardex
}

const CreateDocumento = ({ kardex }: Props) => {

    const docsURL = import.meta.env.VITE_DOC_URL
    const access = useAuthStore((s) => s.access_token) || ''
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    

  const handleOpenWord = async () => {

    try {
      if (kardex.fktemplate === 0) {
        setOpen(true);
        return;
      }
      // Step 1: Call Django to get the populated .docx file as a Blob
      const response = await axios.get(
        `${docsURL}documentos/open-template/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}`,
        {
          responseType: 'blob', // IMPORTANT: to get binary data
          headers: {
            'Authorization': `Bearer ${access}`,
          }
        }
      )

      // Step 2: Create a Blob URL from the downloaded file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const blobUrl = window.URL.createObjectURL(blob);

      // Step 3: Try opening Word with ms-word protocol (will only work if the document is served from a web URL)
      // This fallback just opens the file locally
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `__PROY__${kardex.kardex}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);


      // Optional: revoke URL later to clean memory
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error('Error opening Word document:', error);
    } finally {
      queryClient.invalidateQueries({ queryKey: ["documents by kardex", `${kardex.kardex}`] })
    }
  };

  return (
  <>
      <button
        onClick={handleOpenWord}
        className="mt-8 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 text-xs cursor-pointer"
      >
        Generar Proyecto
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
