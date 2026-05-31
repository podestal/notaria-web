import type { Dispatch, SetStateAction } from "react"
import type { SISGENDocument, SISGENSearchRequest } from "../../services/sisgen/searchSisgenService"
import type { SearchSisgenData } from "./useSearchSisgen"

export const sisgenSearchKeys = {
    all: ["sisgen-search"] as const,
    lastRequest: () => [...sisgenSearchKeys.all, "last-request"] as const,
    search: (params: SISGENSearchRequest) =>
        [...sisgenSearchKeys.all, params] as const,
}

export type SisgenSearchHandlers = {
    setSisgenDocs: Dispatch<SetStateAction<SISGENDocument[]>>
    setItemsCount: Dispatch<SetStateAction<number>>
    setSearchId: Dispatch<SetStateAction<string>>
    setNoDocsMessage: Dispatch<SetStateAction<string>>
    setErrorDisplay: Dispatch<SetStateAction<string>>
    setLoading: Dispatch<SetStateAction<boolean>>
}

const handlersRef: { current: SisgenSearchHandlers | null } = { current: null }

export const registerSisgenSearchHandlers = (handlers: SisgenSearchHandlers) => {
    handlersRef.current = handlers
}

export const getSisgenSearchHandlers = () => handlersRef.current

export const cacheLastSisgenSearchRequest = (
    setQueryData: (
        key: ReturnType<typeof sisgenSearchKeys.lastRequest>,
        data: SearchSisgenData,
    ) => void,
    variables: SearchSisgenData,
) => {
    setQueryData(sisgenSearchKeys.lastRequest(), variables)
}
