import DateInput from "../../ui/DateInput"
import SimpleInput from "../../ui/SimpleInput"

const EscrituracionForm = () => {
  return (
    <form className="flex flex-col justify-center items-center gap-6 w-full my-6">
            <div className=" w-[80%]">
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="N° de Acta"
                        required
                    />
                    {/* <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Al"
                    /> */}
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="N° de Folio del"
                    />
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Al"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Serie Notarial del"
                    />
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Al"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Tomo"
                    />
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Registro"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Papel de trasl notarial"
                    />
                    <SimpleInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Al"
                    />
                </div>
                <div className="grid grid-cols-2 gap-8 my-4">
                    <DateInput 
                        setValue={() => {}}
                        value=""
                        horizontal
                        label="Fecha de Acta"
                        required
                    />
                    <div className="flex items-center justify-start">
                    <button
                        className="gap-1 px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors cursor-pointer flex flex-col my-4 justify-center items-center"
                        type="button"
                        // onClick={() => setOpen(true)}
                    >
                        {/* <Newspaper /> */}
                        <p className="text-xs">Generar</p>
                    </button>
                    </div>
                </div>
                <button
                    className="mt-8 bg-blue-600 text-white cursor-pointer px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-300"
                >
                    Guardar
                </button>
            </div>

    </form>
  )
}

export default EscrituracionForm