
import { useState } from "react";
import SisgenSearchForm from "./SisgenSearchForm";
import SIsgenSearchTable from "./SIsgenSearchTable";
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";

interface Props {
    typekardex: string;
    instrumentType: number
}

const SisgenBody = ({ typekardex, instrumentType }: Props) => {

    const [sisgenDocs, setSisgenDocs] = useState<SISGENDocument[]>([]);

  return (
    <div className="w-full my-6">
        <h2 className="text-xl font-bold">{typekardex}</h2>
        <SisgenSearchForm 
          instrumentType={instrumentType}
          setSisgenDocs={setSisgenDocs}
        />
        <SIsgenSearchTable sisgenDocs={sisgenDocs} />
    </div>
  )
}

export default SisgenBody