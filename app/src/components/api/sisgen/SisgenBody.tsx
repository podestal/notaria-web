
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { registerSisgenSearchHandlers } from "../../../hooks/sisgen/sisgenSearchKeys";
import SisgenSearchForm from "./SisgenSearchForm";
import SIsgenSearchTable from "./SIsgenSearchTable";
import { SISGENDocument } from "../../../services/sisgen/searchSisgenService";
import Paginator from "../../ui/Paginator";
import SisgenBooksTable from "./SisgenBooksTable";
import LoadingState from "../../ui/LoadingState";
import { AnimatePresence, motion } from "framer-motion";
import { CalendarSearch, FileStack, SearchX } from "lucide-react";

interface Props {
    typekardex: string;
    instrumentType: number
    sisgenDocs: SISGENDocument[]
    setSisgenDocs: Dispatch<SetStateAction<SISGENDocument[]>>
    itemsCount: number
    setItemsCount: Dispatch<SetStateAction<number>>
    page: number
    setPage: Dispatch<SetStateAction<number>>
    noDocsMessage: string
    setNoDocsMessage: Dispatch<SetStateAction<string>>
}

const SisgenBody = ({ typekardex, instrumentType, sisgenDocs, setSisgenDocs, itemsCount, setItemsCount, page, setPage, noDocsMessage, setNoDocsMessage }: Props) => {

    const [searchId, setSearchId] = useState('');
    const [selectedEstado, setSelectedEstado] = useState(-1);
    const [loading, setLoading] = useState(false)

    const [selectedFromDate, setSelectedFromDate] = useState<Date | undefined>(undefined);
    const [selectedToDate, setSelectedToDate] = useState<Date | undefined>(undefined);
    const [errorDisplay, setErrorDisplay] = useState('');

    const searchHandlers = useMemo(
        () => ({
            setSisgenDocs,
            setItemsCount,
            setSearchId,
            setNoDocsMessage,
            setErrorDisplay,
            setLoading,
        }),
        [
            setSisgenDocs,
            setItemsCount,
            setSearchId,
            setNoDocsMessage,
            setErrorDisplay,
            setLoading,
        ],
    )

    useEffect(() => {
        registerSisgenSearchHandlers(searchHandlers)
    }, [searchHandlers])

  return (
    <motion.div
        key={instrumentType}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="w-full space-y-5"
    >
        <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
                <div className="rounded-xl bg-blue-50 p-2.5 ring-1 ring-blue-100">
                    <FileStack className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-slate-800">{typekardex}</h2>
                    <p className="text-xs text-slate-500">Filtre por estado y rango de fechas para consultar los documentos</p>
                </div>
            </div>
            <AnimatePresence>
                {itemsCount > 0 && (
                    <motion.div
                        key="count"
                        initial={{ opacity: 0, scale: 0.85 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.85 }}
                        transition={{ type: "spring", stiffness: 300, damping: 22 }}
                        className="flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs text-blue-700"
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                        <span><span className="font-semibold">{itemsCount}</span> documentos encontrados</span>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        <SisgenSearchForm 
          instrumentType={instrumentType}
          setSisgenDocs={setSisgenDocs}
          page={page}
          setPage={setPage}
          setItemsCount={setItemsCount}
          searchId={searchId}
          setSearchId={setSearchId}
          selectedEstado={selectedEstado}
          setSelectedEstado={setSelectedEstado}
          loading={loading}
          setLoading={setLoading}
          setNoDocsMessage={setNoDocsMessage}
          selectedFromDate={selectedFromDate}
          setSelectedFromDate={setSelectedFromDate}
          selectedToDate={selectedToDate}
          setSelectedToDate={setSelectedToDate}
          setErrorDisplay={setErrorDisplay}
          errorDisplay={errorDisplay}
          searchHandlers={searchHandlers}
        />
        <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-slate-200 bg-white shadow-sm"
          >
            <LoadingState message="Buscando documentos…" description="Consultando SISGEN" />
          </motion.div>
        ) : sisgenDocs.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-200"
            >
              {noDocsMessage
                ? <SearchX className="h-6 w-6 text-slate-400" />
                : <CalendarSearch className="h-6 w-6 text-blue-500" />}
            </motion.div>
            <p className="text-sm font-semibold text-slate-700">
              {noDocsMessage || 'Aún no hay resultados'}
            </p>
            {!noDocsMessage && (
              <p className="max-w-sm text-xs text-slate-500">
                Seleccione un rango de fechas y presione <span className="font-semibold">Buscar</span> para consultar los documentos.
              </p>
            )}
          </motion.div>
        ) : (
        <motion.div
          key="results"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
        >
        <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
        {instrumentType === 5 
        ? 
        <SisgenBooksTable sisgenDocs={sisgenDocs} noDocsMessage={noDocsMessage} /> 
        : 
        <SIsgenSearchTable 
          sisgenDocs={sisgenDocs} 
          noDocsMessage={noDocsMessage} 
          setPage={setPage} 
          instrumentType={instrumentType} 
          selectedFromDate={selectedFromDate} 
          selectedToDate={selectedToDate} 
          selectedEstado={selectedEstado} 
          page={page} 
          setSisgenDocs={setSisgenDocs}
          setItemsCount={setItemsCount}
          setSearchId={setSearchId} 
          setNoDocsMessage={setNoDocsMessage} 
          setErrorDisplay={setErrorDisplay} 
          searchId={searchId}
          setLoading={setLoading}
          searchHandlers={searchHandlers}
        />}
        </div>
        </div>
        <Paginator page={page} setPage={setPage} itemsCount={itemsCount} />
        </motion.div>
        )}
        </AnimatePresence>
    </motion.div>
  )
}

export default SisgenBody