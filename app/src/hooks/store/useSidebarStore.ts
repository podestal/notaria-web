import { create } from "zustand"

const STORAGE_KEY = "sidebar-collapsed"

const getStoredCollapsed = (): boolean => {
    try {
        return localStorage.getItem(STORAGE_KEY) === "1"
    } catch {
        return false
    }
}

const storeCollapsed = (collapsed: boolean) => {
    try {
        localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0")
    } catch {
        // Storage can be unavailable; keep in-memory state for this session.
    }
}

export const SIDEBAR_WIDTH_EXPANDED = 224 // w-56
export const SIDEBAR_WIDTH_COLLAPSED = 72 // w-[4.5rem]

interface SidebarStore {
    collapsed: boolean
    setCollapsed: (collapsed: boolean) => void
    toggleCollapsed: () => void
}

const useSidebarStore = create<SidebarStore>((set, get) => ({
    collapsed: getStoredCollapsed(),
    setCollapsed: (collapsed) => {
        storeCollapsed(collapsed)
        set({ collapsed })
    },
    toggleCollapsed: () => {
        const next = !get().collapsed
        storeCollapsed(next)
        set({ collapsed: next })
    },
}))

export default useSidebarStore
