import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query"
import Calendar from "../../../ui/Calendar"
import { Sheet, FileText, Loader2 } from "lucide-react"
import { useState } from "react"
import axios from "axios"
import useAuthStore from "../../../../store/useAuthStore"



interface Props {
    dateFrom: Date | undefined
    dateTo: Date | undefined
    setDateFrom: React.Dispatch<React.SetStateAction<Date | undefined>>
    setDateTo: React.Dispatch<React.SetStateAction<Date | undefined>>
    refetch:(options?: RefetchOptions) => Promise<QueryObserverResult<any, Error>>
    generatesWord: boolean
    generatesExcel: boolean
    url: string
    params: Record<string, string>
    name: string
}

const ExtraProtocolaresHeader = ({ 
    dateFrom, 
    dateTo, 
    setDateFrom, 
    setDateTo, 
    refetch,
    generatesWord,
    generatesExcel,
    url,
    params,
    name
}: Props) => {
    const access = useAuthStore(s => s.access_token) || ''
    const apiURL = import.meta.env.VITE_API_URL
    const [loadingWord, setLoadingWord] = useState(false)
    const [loadingExcel, setLoadingExcel] = useState(false)
    const [loading, setLoading] = useState(false)


    const handleFilter = () => {
        if (loading) return;
        setLoading(true)
        refetch().finally(() => {
            setLoading(false)
        })
    }

    const handleGenerateWord = async () => {
        if (loadingWord) return; // Prevent multiple clicks during loading
        
        setLoadingWord(true);
        
        try {
          const isWindows = /Windows/.test(navigator.userAgent);
          const mode = isWindows ? 'open' : 'download';
  
          console.log(`OS: ${isWindows ? 'Windows' : 'Other'}, Mode: ${mode}`);
          
          const response = await axios.get(
            `${apiURL}${url}/`,
            {
              responseType: mode === 'download' ? 'blob' : 'json',
              headers: {
                'Authorization': `JWT ${access}`,
              },
              params: {
                ...params
              }
            }
          );
  
          if (mode === 'open' && response.data.mode === 'open' && response.data.url) {
            // Windows: Open in Word using the secure backend URL
            const wordUrl = `ms-word:ofe|u|${response.data.url}`;
            window.open(wordUrl, '_blank');
            return;
          } else {
            // Download mode (iOS, Mac, Linux, or fallback)
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
          }
  
        } catch (error) {
          console.log('error', error)
        
        } finally {
          setLoadingWord(false);
        }
    }

    const handleGenerateExcel = async () => {
      if (loadingExcel) return; // Prevent multiple clicks during loading
        
      setLoadingExcel(true);
      
      try {
        const isWindows = /Windows/.test(navigator.userAgent);
        const mode = isWindows ? 'open' : 'download';

        console.log(`OS: ${isWindows ? 'Windows' : 'Other'}, Mode: ${mode}`);
        
        const response = await axios.get(
          `${apiURL}${url}/`,
          {
            responseType: mode === 'download' ? 'blob' : 'json',
            headers: {
              'Authorization': `JWT ${access}`,
            },
            params: {
              ...params,
              tipo_documento: 'EXCEL'
            }
          }
        );

        if (mode === 'open' && response.data.mode === 'open' && response.data.url) {
          // Windows: Open in Excel using the secure backend URL
          const excelUrl = `ms-excel:ofe|u|${response.data.url}`;
          window.open(excelUrl, '_blank');
          return;
        } else {
          // Download mode (iOS, Mac, Linux, or fallback)
          const blob = new Blob([response.data], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          });
          const blobUrl = window.URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = blobUrl;
          
          link.download = `${name}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => window.URL.revokeObjectURL(blobUrl), 10000);
        }

      } catch (error) {
        console.log('error', error)
      
      } finally {
        setLoadingExcel(false);
      }
        
    }

  return (
<div className="w-full grid grid-cols-6 gap-4 justify-center items-center text-center my-6">
        <div className="flex flex-col col-span-2 justify-center items-center gap-4 font-semibold text-sm">
            <p>Fecha Inicio</p>
            <Calendar selectedDate={dateFrom} setSelectedDate={setDateFrom} />
        </div>
        <div className="flex flex-col col-span-2 justify-center items-center gap-4 font-semibold text-sm">
            <p>Fecha Fin</p>
            <Calendar selectedDate={dateTo} setSelectedDate={setDateTo} />
        </div>
        <div>
            <button 
                onClick={handleFilter}
                className="bg-blue-500 text-white rounded-lg text-sm py-2 px-4 hover:bg-blue-600 cursor-pointer"
                disabled={loading}
            >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Buscar'}
            </button>
        </div>
        <div className="flex justify-center items-center gap-8">
            <div 
                className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleGenerateWord}
            >
                <FileText className="w-6 h-6 text-blue-500 hover:text-blue-700 cursor-pointer mb-2" />
                {!loadingWord && <p className="text-[10px] text-center text-gray-700">Word</p>}
                {loadingWord && <p className="text-[10px] text-center text-gray-700 animate-pulse">Cargando...</p>}
            </div>  
            <div 
                className="flex flex-col items-center justify-center w-20 h-20 bg-white shadow-md rounded-lg mt-4 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleGenerateExcel}
            >
                <Sheet className="w-6 h-6 text-green-500 hover:text-green-700 cursor-pointer mb-2" />
                {!loadingExcel && <p className="text-[10px] text-center text-gray-700">Excel</p>}
                {loadingExcel && <p className="text-[10px] text-center text-gray-700 animate-pulse">Cargando...</p>}
            </div>
        </div>
    </div>
  )
}

export default ExtraProtocolaresHeader