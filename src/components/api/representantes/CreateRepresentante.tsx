import useGetSedesRegistrales from "../../../hooks/api/sedesRegistrales/useGetSedesRegistrales"
import useAuthStore from "../../../store/useAuthStore"
import RepresentantesForm from "./RepresentantesForm"

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateRepresentante = ({ open, setOpen }: Props) => {

    const access = useAuthStore(s => s.access_token) || ''
    const { data: sedesRegistrales, isLoading, isError, error, isSuccess } = useGetSedesRegistrales({ access })

    if (isLoading) return <p className="text-md animate-pulse text-center">Cargando ...</p>

    if (isError) return <p className="text-md text-red-500 text-center">Error: {error.message}</p>
    if (isSuccess) 

  return (
    <div>
        <RepresentantesForm 
            open={open}
            setOpen={setOpen}
            sedesRegistrales={sedesRegistrales}
        />
    </div>
  )
}

export default CreateRepresentante