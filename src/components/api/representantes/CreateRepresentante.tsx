import RepresentantesForm from "./RepresentantesForm"

interface Props {
    open: boolean
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateRepresentante = ({ open, setOpen }: Props) => {
  return (
    <div>
        <RepresentantesForm 
            open={open}
            setOpen={setOpen}
        />
    </div>
  )
}

export default CreateRepresentante