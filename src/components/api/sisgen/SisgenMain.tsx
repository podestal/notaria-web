import { useState } from "react";
import KardexFormTabs from "../kardex/KardexFormTabs"
import SisgenBody from "./SisgenBody"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";


const SisgenMain = () => {

  const [sisgenDocs, setSisgenDocs] = useState<SISGENDocument[]>([]);
  const [itemsCount, setItemsCount] = useState(0);

  const extraFunction = () => {
    setSisgenDocs([]);
    setItemsCount(0);
  }

  return (
    <div className="mt-[80px] w-[85%] h-screen mx-auto bg-slate-100 rounded-lg shadow-lg mb-10 text-black flex flex-col items-center justify-start">
        <KardexFormTabs 
            extraFunction={extraFunction}
            tabs={[
                // { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
                { id: 'escrituras', label: 'Escrituras', content: <SisgenBody itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Escrituras Públicas" instrumentType={1} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/>},
                { id: 'transferencias', label: 'Transferencias', content: <SisgenBody itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Transferencias Vehiculares" instrumentType={3} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'garantias', label: 'Garantías', content: <SisgenBody itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Garantías Inmobiliarias" instrumentType={4} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'no-contenciosos', label: 'No Contenciosos', content: <SisgenBody itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="No Contenciosos" instrumentType={2} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'libros', label: 'Libros', content: <SisgenBody itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Libros Contables" instrumentType={5} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
            ]}
        />
    </div>
  )
}

export default SisgenMain