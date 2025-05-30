import { useState } from "react"

const ClientesForm = () => {

    // idcontratante = models.CharField(primary_key=True, max_length=10)
    // idcliente = models.CharField(max_length=10)
    // tipper = models.CharField(max_length=1)
    // apepat = models.CharField(max_length=100)
    // apemat = models.CharField(max_length=100)
    // prinom = models.CharField(max_length=100)
    // segnom = models.CharField(max_length=100)
    // nombre = models.CharField(max_length=1000)
    // direccion = models.CharField(max_length=3000)

    const [apepat, setApepat] = useState('')
    const [apemat, setApemat] = useState('')
    const [prinom, setPrinom] = useState('')
    const [segnom, setSegnom] = useState('')
    const [direccion, setDireccion] = useState('')
    const [nombre, setNombre] = useState('')

  return (
    <form>
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Apellido Paterno</label>
            <input 
                value={apepat}
                onChange={(e) => setApepat(e.target.value)}
                placeholder="Apellido Paterno"
                className="w-full bg-white text-slate-700 border border-slate-300 rounded-md py-2 px-3 focus:border-blue-700 focus:outline-none"
            />
        </div>
    </form>
  )
}

export default ClientesForm