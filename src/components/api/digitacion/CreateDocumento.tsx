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
    
    const handleOpenDocument = async () => {

      if (kardex.fktemplate === 0) {
        setOpen(true);
        return;
      }

      try {
          const isWindows = /Windows/.test(navigator.userAgent);
          const mode = isWindows ? 'open' : 'download';
          
          console.log(`OS: ${isWindows ? 'Windows' : 'Other'}, Mode: ${mode}`);

          const response = await axios.get(
            `${docsURL}documentos/open-template/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}&mode=${mode}`,
            {
              responseType: mode === 'download' ? 'blob' : 'json',
              headers: {
                'Authorization': `Bearer ${access}`,
              }
            }
          );

          if (mode === 'open' && response.data.mode === 'open') {
            // Windows: Try to open Word
            try {
              // Download the file first
              const downloadResponse = await axios.get(
                `${docsURL}documentos/open-template/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}&mode=download`,
                {
                  responseType: 'blob',
                  headers: {
                    'Authorization': `Bearer ${access}`,
                  }
                }
              );

              const blob = new Blob([downloadResponse.data], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
              });
              
              // Try to open with Word protocol
              const fileName = `__PROY__${kardex.kardex}.docx`;
              const wordUrl = `ms-word:ofe|u|${window.location.origin}/temp/${fileName}`;
              window.open(wordUrl, '_blank');
              
              // Also download as fallback
              const blobUrl = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = blobUrl;
              link.download = fileName;
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              
              setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
              
            } catch (error) {
              console.error('Error opening Word:', error);
              // Fallback to download
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
            }
          } else {
            // Download mode (iOS, Mac, Linux, or fallback)
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
          }
          
        } catch (error) {
          console.error('Error opening Word document:', error);
          alert('Error opening document. Please try again.');
        } finally {
          queryClient.invalidateQueries({ queryKey: ["documents by kardex", `${kardex.kardex}`] })
        }
    };

  return (
  <>
      <button
        onClick={handleOpenDocument}
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
