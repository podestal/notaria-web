import axios from "axios";
import { Kardex } from "../../../services/api/kardexService";

interface Props {
  kardex: Kardex
}

const CreateDocumento = ({ kardex }: Props) => {

    // const openInWord = () => {
    //     const rawURL = "https://quenteh.podestalservers.com/docs/documentos/open-template/?template_id=3";
    //     const officeURL = `ms-word:ofe|u|${encodeURIComponent(rawURL)}`;
    //     window.location.href = officeURL;
    //   };

    // const openInWord = async () => {
    //     // const templateId = 3;
    //     // const url = `https://quenteh.podestalservers.com/docs/documentos/open-template/?template_id=${templateId}`;
    //     const cleanURL = `https://quenteh.podestalservers.com/docs/documentos/open-template/?template_id=3`;
    //     const officeURL = `ms-word:ofe|u|${cleanURL}`;
    //     window.location.href = officeURL;
    //   };

    // const handleOpenInWord = async () => {
    //     try {
    //       const res = await axios.get(
    //         'http://127.0.0.1:8001/docs/documentos/template-download/?template_id=3'
    //       );
    
    //       const { url } = res.data;
    
    //       // This opens the file in Microsoft Word (only works on desktop with MS Word installed)
    //       window.location.href = `ms-word:ofe|u|${url}`;
    //     } catch (err) {
    //       console.error('Error opening Word:', err);
    //     }
    //   };

  const handleOpenWord = async () => {

    try {
      
      // Step 1: Call Django to get the populated .docx file as a Blob
      const response = await axios.get(
        `https://quenteh.podestalservers.com/docs/documentos/open-template/?template_id=${kardex.fktemplate}&kardex=${kardex.kardex}`,
        {
          responseType: 'blob', // IMPORTANT: to get binary data
        }
      );

      // Step 2: Create a Blob URL from the downloaded file
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });
      const blobUrl = window.URL.createObjectURL(blob);

      // Step 3: Try opening Word with ms-word protocol (will only work if the document is served from a web URL)
      // This fallback just opens the file locally
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = 'documento.docx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Optional: revoke URL later to clean memory
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
    } catch (error) {
      console.error('Error opening Word document:', error);
    }
  };

  return (
    <button
      onClick={handleOpenWord}
      className="mt-8 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors duration-300 text-xs cursor-pointer"
    >
      Generar Proyecto
    </button>
  );
};

export default CreateDocumento;
