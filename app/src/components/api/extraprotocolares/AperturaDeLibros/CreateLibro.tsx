import useCreateLibro from "../../../../hooks/api/extraprotocolares/aperturaLibros/useCreateLibro";
import PreLibroForm from "./PreLibroForm"



const CreateLibro = () => {

  const createLibro = useCreateLibro();

  return (
    <PreLibroForm 
      createLibro={createLibro}
    />
  )
}

export default CreateLibro