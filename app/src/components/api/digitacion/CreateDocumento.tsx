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
  hasExistingDocument?: boolean
}

const CreateDocumento = ({ kardex, hasExistingDocument = false }: Props) => {

    const docsURL = import.meta.env.VITE_DOC_URL
    const access = useAuthStore((s) => s.access_token) || ''
    const queryClient = useQueryClient()
    const [open, setOpen] = useState(false)
    const [openWarning, setOpenWarning] = useState(false)
    const [loading, setLoading] = useState(false)

    const generateDocument = async () => {
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
    
    const handleOpenDocument = () => {
      if (hasExistingDocument) {
        setOpenWarning(true);
        return;
      }
      void generateDocument();
    };

    const handleConfirmRegenerate = () => {
      setOpenWarning(false);
      void generateDocument();
    };

  return (
  <>
      <button
        onClick={handleOpenDocument}
        disabled={loading}
        className="mt-8 inline-flex min-w-[9.5rem] items-center justify-center gap-2 rounded-md bg-red-600 px-4 py-2 text-xs text-white transition-colors duration-300 hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading && <Loader className="h-4 w-4 shrink-0 animate-spin" aria-hidden />}
        {loading ? "Generando..." : "Generar Proyecto"}
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
      <TopModal
        isOpen={openWarning}
        onClose={() => setOpenWarning(false)}
      >
        <ExplanationMessage
          message="Ya existe un proyecto para este kardex. Si genera uno nuevo, se reemplazará el documento actual. ¿Desea continuar?"
          onClick={handleConfirmRegenerate}
          onClickMessage="Continuar"
          onClickSecondary={() => setOpenWarning(false)}
          onClickSecondaryMessage="Cancelar"
        />
      </TopModal>
    </>
  );
};

export default CreateDocumento;
