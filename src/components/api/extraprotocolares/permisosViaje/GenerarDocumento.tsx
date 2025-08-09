import axios from "axios";
import useAuthStore from "../../../../store/useAuthStore";
import { FileCog } from "lucide-react";
import { PermisoViaje } from "../../../../services/api/extraprotocolares/permisoViajeService";

interface Props {
    permiso: PermisoViaje
}

const GenerarDocumento = ({ permiso }: Props) => {
    const access = useAuthStore((s) => s.access_token) || ''
    const docsURL = import.meta.env.VITE_DOC_URL
    const typePermisoUrl = permiso.asunto === '001' ? 'permiso-viaje-interior' : 'permiso-viaje-exterior'

    const handleOpenDocument = async () => {
  
        try {
          const isWindows = /Windows/.test(navigator.userAgent);
          const mode = isWindows ? 'open' : 'download';
  
          console.log(`OS: ${isWindows ? 'Windows' : 'Other'}, Mode: ${mode}`);
  // generate-document
          const response = await axios.get(
            `${docsURL}extraprotocolares/${typePermisoUrl}/?id_viaje=${permiso.id_viaje}`,
            {
              responseType: mode === 'download' ? 'blob' : 'json',
              headers: {
                'Authorization': `JWT ${access}`,
              }
            }
          );
  
          if (mode === 'open' && response.data.mode === 'open' && response.data.url) {
            // Windows: Open in Word using the secure backend URL
            const wordUrl = `ms-word:ofe|u|${response.data.url}`;
            window.open(wordUrl, '_blank');
            // Optionally, you can show a message or return here
            return;
          } else {
            // Download mode (iOS, Mac, Linux, or fallback)
            const blob = new Blob([response.data], {
              type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            });
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = `__PROY__${permiso.num_kardex}.docx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
          }
  
        } catch (error) {
          console.error('Error opening Word document:', error);
        } finally {
        //   queryClient.invalidateQueries({ queryKey: ["documents by kardex", `${kardex.kardex}`] })
        }
      };

  return (
    <div 
        onClick={handleOpenDocument}
        className=" w-full flex items-center justify-between px-4 py-2 gap-1 bg-blue-200 rounded-lg mb-4 text-blue-600 hover:opacity-85 cursor-pointer">
        <FileCog className="text-xl text-green-600"/>
        <p className="text-xs">Generar</p>
        
    </div>
  )
}

export default GenerarDocumento