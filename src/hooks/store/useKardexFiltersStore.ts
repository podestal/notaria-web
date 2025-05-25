import { create } from "zustand"


export interface FilterInterface {
    type: 'K' | 'N' | 'D' | 'E' | ''
    value: string
}

interface FilterState {
    kardexFilter: FilterInterface
    setKardexFilter: (filter: FilterInterface) => void
}

const useKardexFiltersStore = create<FilterState>(set => ({
    kardexFilter: {
        type: '',
        value: ''
    },
    setKardexFilter: (kardexFilter) => {
        set({ kardexFilter })
    }
}))

export default useKardexFiltersStore
