import { create } from "zustand"

interface BodyRenderState {
    bodyRender: number
    setBodyRender: (bodyRender: number) => void
}
const useBodyRenderStore = create<BodyRenderState>(set => ({
    bodyRender: 1,
    setBodyRender: (bodyRender) => {
        set({ bodyRender })
    }
}))

export default useBodyRenderStore
