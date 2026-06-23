import { useState } from "react";
import { Navigate } from "react-router-dom";
import KardexFormTabs from "../kardex/KardexFormTabs"
import SisgenBody from "./SisgenBody"
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";
import useUserInfoStore from "../../../hooks/store/useGetUserInfo";


const SisgenMain = () => {
  const user = useUserInfoStore((s) => s.user);
  const isSuperuser = Number(user?.is_superuser) !== 0;

  const [sisgenDocs, setSisgenDocs] = useState<SISGENDocument[]>([]);
  const [itemsCount, setItemsCount] = useState(0);
  const [page, setPage] = useState(1);
  const [noDocsMessage, setNoDocsMessage] = useState('')

  if (!isSuperuser) {
    return <Navigate to="/app/protocolares" replace />;
  }

  const extraFunction = () => {
    setSisgenDocs([]);
    setItemsCount(0);
    setPage(1);
    setNoDocsMessage('')
  }

  return (
    <div className="mx-auto mb-10 mt-[80px] w-[85%] rounded-lg bg-slate-100 pb-10 text-black shadow-lg">
        <KardexFormTabs 
            extraFunction={extraFunction}
            tabs={[
                // { id: 'general', label: 'Kardex Info', content: <KardexForm createKardex={createKardex} setNotAllowed={setNotAllowed} /> },
                { id: 'escrituras', label: 'Escrituras', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Escrituras Públicas" instrumentType={1} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/>},
                { id: 'transferencias', label: 'Transferencias', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Transferencias Vehiculares" instrumentType={3} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'garantias', label: 'Garantías', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Garantías Inmobiliarias" instrumentType={4} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'no-contenciosos', label: 'No Contenciosos', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="No Contenciosos" instrumentType={2} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
                { id: 'libros', label: 'Libros', content: <SisgenBody noDocsMessage={noDocsMessage} setNoDocsMessage={setNoDocsMessage} page={page} setPage={setPage} itemsCount={itemsCount} setItemsCount={setItemsCount} typekardex="Libros Contables" instrumentType={5} sisgenDocs={sisgenDocs} setSisgenDocs={setSisgenDocs}/> },
            ]}
        />
    </div>
  )
}

export default SisgenMain