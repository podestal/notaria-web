import { useState } from "react"
import SimpleSelectorStr from "../../ui/SimpleSelectosStr"
import SimpleInput from "../../ui/SimpleInput"


const PrediosForm = () => {

        const [topoZona, setTopoZona] = useState('')
        const [zona, setZona] = useState('')
        const [denominacion, setDenominacion] = useState('')
        const [tipoVia, setTipoVia] = useState('')
        const [nombreVia, setNombreVia] = useState('')
        const [numero, setNumero] = useState('')
        const [manzana, setManzana] = useState('')
        const [lote, setLote] = useState('')

  return (
    <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-center mt-2 mb-6">Datos del Predio</h2>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelectorStr 
                options={[
                    { value: '.', label: 'Seleccionar' },
                    { value: 'URB.', label: 'Urbanización' },
                    { value: 'BAR.', label: 'Barrio' },
                    { value: 'VLL.', label: 'Villa' }
                ]}
                label="Tipo de Zona"
                defaultValue={topoZona}
                setter={setTopoZona}
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={zona}
                setValue={setZona}
                label="Zona"
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={denominacion}
                setValue={setDenominacion}
                label="Denominación"
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleSelectorStr 
                options={[
                    { value: '.', label: 'Seleccionar' },
                    { value: 'AV.', label: 'Avenida' },
                    { value: 'JR.', label: 'Jirón' },
                    { value: 'CAL.', label: 'Calle' },
                    { value: 'PQ.', label: 'Parque' },
                    { value: 'CAR.', label: 'Carretera' },
                    { value: 'PRO.', label: 'Prolongación' },
                    { value: 'PJ.', label: 'Pasaje' },
                    { value: 'PZA.', label: 'Plaza' },
                    { value: 'GAL.', label: 'Galería' },
                    { value: 'ALM.', label: 'Alameda' },
                    { value: 'BLV.', label: 'Bulevar' },
                    { value: 'BL.', label: 'Bloque'},
                    { value: 'MLC.', label: 'Malecón' },
                    { value: 'VIA.', label: 'Vía' },
                    { value: 'OVL.', label: 'Óvalo' },
                ]}
                label="Tipo de Vía"
                defaultValue={tipoVia}
                setter={setTipoVia}
                horizontal
            />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={nombreVia}
                setValue={setNombreVia}
                label="Nombre de la Vía"
                horizontal
            />
        </div>
        <div>
            <div className="grid grid-cols-2 gap-4 mt-4">
                <SimpleInput 
                    value={numero}
                    setValue={setNumero}
                    label="Número"
                    horizontal
                />
                <SimpleInput 
                    value={manzana}
                    setValue={setManzana}
                    label="Manzana"
                    horizontal
                />
            </div>
        </div>
                <div className="grid grid-cols-2 gap-4">
            <SimpleInput 
                value={lote}
                setValue={setLote}
                label="Lote"
                horizontal
            />
        </div>
        <div className="w-full flex justify-evenly items-center gap-4 mt-6">
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                type="button"
            >
                Buscar
            </button>
            <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
                type="button"
            >
                Guardar
            </button>
        </div>
    </div>
  )
}

export default PrediosForm