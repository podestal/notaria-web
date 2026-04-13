import { create } from "zustand"
import { Tipokardex } from "../../services/api/tipokardexService"

interface KardexTypesStore {
    kardexTypes: Tipokardex[]
    setKardexTypes: (kardexTypes: Tipokardex[]) => void
}

const useKardexTypesStore = create<KardexTypesStore>((set) => ({
    kardexTypes: [],
    setKardexTypes: (kardexTypes) => set({ kardexTypes }),
}))

export default useKardexTypesStore