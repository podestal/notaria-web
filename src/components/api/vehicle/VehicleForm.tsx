import { useState } from "react"
import SimpleInput from "../../ui/SimpleInput"
import SimpleSelector from "../../ui/SimpleSelector"
import VehicleLooker from "./VehicleLooker"

const types = [
    {value: 1, label: 'Placa'},
    {value: 2, label: 'Poliza'},
]


const VehicleForm = () => {

    const [plate, setPlate] = useState('');
//     color: "BLANCO"
// ​​
// marca: "JAC"
// ​​
// modelo: "T8"
// ​​
// motor: "HFC1037D3KSVM4100645"
// ​​
// placa: "X4X948"
// ​​
// serie: "LJ11PABD0NC080391"
// ​​
// vin: "LJ11PABD0NC080391"


  return (
    <form className="flex flex-col gap-4 p-4 bg-white rounded shadow-md">
        <div className="grid grid-cols-2 gap-4 items-center">
            <SimpleSelector
                options={types}
                defaultValue={1}
                setter={() => {}}
                label="Tipo de vehiculo"
                required
            />
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Carrocería"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-4 gap-4">
            <div className="col-span-2 flex items-center gap-6">
            <SimpleInput 
                value={plate}
                setValue={setPlate}
                label="N Placa/Poliza"
                horizontal
                required
            />
            <VehicleLooker 
                plate={plate}
            />
            </div>
            <div  className="col-span-2 flex items-center gap-6">
                <SimpleInput 
                    value=""
                    setValue={() => {}}
                    label="Color"
                    horizontal
                    required
                />
            </div>
    

        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Clase"
                horizontal
                required
            />
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Motor"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Marca"
                horizontal
                required
            />
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Cilindros"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Año fabricación"
                horizontal
                required
            />
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Numero de serie"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Modelo"
                horizontal
                required
            />
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Ruedas"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Combustible"
                horizontal
                required
            />
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Fecha de inscripción"
                horizontal
                required
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value=""
                setValue={() => {}}
                label="Partida Registral"
                horizontal
                required
            />
            <SimpleSelector
                options={[
                    {value: 1, label: 'Seleccionar'},
                    {value: 2, label: 'Inactivo'},
                ]}
                defaultValue={1}
                setter={() => {}}
                label="Sede Registral"
                required
            />
        </div>
        <div className="w-full flex justify-items-center items-center my-4 text-center">
            <button className=" bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors cursor-pointer" type="submit">
                Grabar
            </button>
        </div>
    </form>
  )
}

export default VehicleForm