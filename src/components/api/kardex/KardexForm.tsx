import { FileText } from "lucide-react"

const KardexForm = () => {
  return (
    <form className="bg-slate-700 rounded-b-lg shadow-lg w-full ">
        <div className="flex justify-center items-center gap-2 p-4 rounded-t-lg text-slate-50 ">
            <FileText className="text-green-600"/>
            <h2 className="text-xl text-amber-500">Nuevo Kardex</h2>
       
        </div>
        <div className="bg-slate-50 text-black p-4 rounded-b-lg">
            <div className="flex justify-between items-center gap-4">
                <p>Tipo de Kardex ...select</p>
                <p>Fecha ...fecha todays</p>
                <p>Hora ... hour now</p>
            </div>
            <p>Referencia - input - button</p>
            <div className="flex justify-between items-center gap-4">
                <p>Codigos de actos ... input</p>
                <p>Derecho Notarial ... input</p>
                <p>Derecho Registral ... input</p>
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>Contrato ... input</p>
                <p>Agregar Acto</p>
                <p>Ocultar Acto</p>
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>rESPONSABLE ... auto user logged in</p>
                <p>Recepción ...select other users</p>
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>Abogado ... select abogados</p>
                <p>Funcionario ...input </p>
            </div>
            <div className="flex justify-between items-center gap-4">
                <p>Presentante ...select</p>
                <p>Plantilla ...Select</p>
            </div>
        </div>


    </form>
  )
}

export default KardexForm