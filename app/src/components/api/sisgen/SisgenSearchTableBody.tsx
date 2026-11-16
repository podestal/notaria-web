import { SISGENDocument } from "../../../services/sisgen/searchSisgenService"
import SisgenSingleCard from "./SisgenSingleCard"

interface Props {
    sisgenDocs: SISGENDocument[]
}

const SisgenSearchTableBody = ({ sisgenDocs }: Props) => {
  return (
    <div className="divide-y divide-slate-100">
      {sisgenDocs.map((doc, idx) => {
        const prev = idx > 0 ? sisgenDocs[idx - 1] : undefined
        return (
          <SisgenSingleCard
            key={doc.idkardex || `${doc.kardex}-${idx}`}
            sisgenDoc={doc}
            prevFolioFin={(prev?.foliofin || "").trim()}
          />
        )
      })}
    </div>
  )
}

export default SisgenSearchTableBody
