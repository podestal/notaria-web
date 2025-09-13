import axios from "axios"
import useAuthStore from "../../../store/useAuthStore"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { useQueryClient } from "@tanstack/react-query"

interface Props {
  kardex: string
  item: number
}

const ParticipaGenerate = ({ kardex, item }: Props) => {

  const access = useAuthStore(s => s.access_token) || ''
  const [isLoading, setIsLoading] = useState(false)
  const queryClient = useQueryClient()

  const handleCalculate = () => {
    setIsLoading(true)
    axios.post(`${import.meta.env.VITE_API_URL}kardex/calculate/`, {
      kardex,
      item,
    }, {
      headers: {
        Authorization: `JWT ${access}`,
      },
    })
    .then(res => {
      console.log(res)
      queryClient.invalidateQueries({ queryKey: ['contratantesPorActoByKardex', kardex] })
    })
    .catch(err => {
      console.log(err)
    })
    .finally(() => {
      setIsLoading(false)
    })
  }
  return (
    <button
        className="gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer flex flex-col my-4 justify-center items-center"
        type="button"
        onClick={handleCalculate}
    >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <p className="text-xs">Calcular</p>}
    </button>
  )
}

export default ParticipaGenerate