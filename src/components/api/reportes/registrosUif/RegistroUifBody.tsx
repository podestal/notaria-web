import { KardexRO } from '../../../../services/api/kardexService'
import KardexFormTabs from '../../kardex/KardexFormTabs'
import ListaDeErrores from './registroTabs/ListaDeErrores'
import ListaDeKardex from './registroTabs/ListaDeKardex'
import RegistroUifSummary from './RegistroUifSummary'

interface Props {
    // listType: string
    // setListType: React.Dispatch<React.SetStateAction<string>>
    kardexRO: KardexRO
}

const RegistroUifBody = ({
    // listType,
    // setListType,
    kardexRO
}: Props) => {
  return (
    <div className="w-[85%] mx-auto mb-10 text-black">
       <RegistroUifSummary />
       <KardexFormTabs 
            tabs={[
                { id: 'errors', label: 'Lista de Errores', content: <ListaDeErrores kardexErrors={kardexRO.lista_errores} /> },
                { id: 'ro', label: 'Lista de Kardex (RO)', content: <ListaDeKardex kardexErrors={kardexRO.lista_kardex_ro} /> },
                { id: 'not_ro', label: 'Lista de Kardex que no envían', content: <p>Lista de Kardex que no envían</p> },
            ]}
        />
    </div>
  )
}

export default RegistroUifBody