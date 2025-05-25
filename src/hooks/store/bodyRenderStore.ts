import { create } from "zustand"

interface BodyRenderState {
    bodyRender: number
    setBodyRender: (bodyRender: number) => void
}
const useBodyRenderStore = create<BodyRenderState>(set => ({
    bodyRender: 0,
    setBodyRender: (bodyRender) => {
        set({ bodyRender })
    }
}))

export default useBodyRenderStore
