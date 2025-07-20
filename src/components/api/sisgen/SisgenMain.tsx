import KardexFormTabs from "../kardex/KardexFormTabs"
import SisgenBody from "./SisgenBody"


const SisgenMain = () => {
  return (
    <div className="mt-[80px] w-[65%] mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black">
        <KardexFormTabs 
            tabs={[
                // { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
                { id: 'escrituras', label: 'Escrituras', content: <SisgenBody typekardex="Escrituras Públicas"/>},
                { id: 'transferencias', label: 'Transferencias', content: <SisgenBody typekardex="Transferencias Vehiculares"/> },
                { id: 'garantias', label: 'Garantías', content: <SisgenBody typekardex="Garantías Inmobiliarias"/> },
                { id: 'no-contenciosos', label: 'No Contenciosos', content: <SisgenBody typekardex="No Contenciosos"/> },
                { id: 'libros', label: 'Libros', content: <SisgenBody typekardex="Libros Contables"/> },
            ]}
        />
    </div>
  )
}

export default SisgenMain