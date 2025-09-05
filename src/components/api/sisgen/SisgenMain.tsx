import KardexFormTabs from "../kardex/KardexFormTabs"
import SisgenBody from "./SisgenBody"


const SisgenMain = () => {
  return (
    <div className="mt-[80px] w-[85%] h-screen mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black flex flex-col items-center justify-start">
        <KardexFormTabs 
            tabs={[
                // { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
                { id: 'escrituras', label: 'Escrituras', content: <SisgenBody typekardex="Escrituras Públicas" instrumentType={1} />},
                { id: 'transferencias', label: 'Transferencias', content: <SisgenBody typekardex="Transferencias Vehiculares" instrumentType={3} /> },
                { id: 'garantias', label: 'Garantías', content: <SisgenBody typekardex="Garantías Inmobiliarias" instrumentType={4} /> },
                { id: 'no-contenciosos', label: 'No Contenciosos', content: <SisgenBody typekardex="No Contenciosos" instrumentType={2} /> },
                { id: 'libros', label: 'Libros', content: <SisgenBody typekardex="Libros Contables" instrumentType={5} /> },
            ]}
        />
    </div>
  )
}

export default SisgenMain