import { create } from "zustand"

interface CorrelativeState {
    correlative: string
    setCorrelative: (correlative: string) => void
}

const useCorrelativeStore = create<CorrelativeState>(set => ({
    correlative: '',
    setCorrelative: (correlative) => {
        set({ correlative })
    }
}))
export default useCorrelativeStore