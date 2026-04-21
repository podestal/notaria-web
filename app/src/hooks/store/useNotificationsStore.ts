import { create } from "zustand"

export interface NotificationItem {
    id: string
    type: string
    message: string
}

interface NotificationsState {
    type: string
    setType: (value: string) => void
    message: string
    setMessage: (value: string) => void
    show: boolean
    setShow: (value: boolean) => void
    notifications: NotificationItem[]
    removeNotification: (id: string) => void
    reset: () => void
}

const PATCH_WINDOW_MS = 160

const useNotificationsStore = create<NotificationsState>((set, get) => ({
    type: '',
    setType: (value) =>
        set((state) => {
            const now = Date.now()
            const patched = state.notifications.map((n) =>
                now - Number(n.id.split('-')[0]) <= PATCH_WINDOW_MS && n.type === state.type
                    ? { ...n, type: value }
                    : n
            )
            return { type: value, notifications: patched }
        }),
    message: '',
    setMessage: (value) =>
        set((state) => {
            const now = Date.now()
            const patched = state.notifications.map((n) =>
                now - Number(n.id.split('-')[0]) <= PATCH_WINDOW_MS && n.message === state.message
                    ? { ...n, message: value }
                    : n
            )
            return { message: value, notifications: patched }
        }),
    show: false,
    setShow: (val) => {
        if (!val) {
            set((state) => ({ show: false, notifications: state.notifications }))
            return
        }
        const { type, message } = get()
        if (!message.trim()) return
        const notification: NotificationItem = {
            id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            type: type || 'info',
            message: message.trim(),
        }
        set((state) => ({
            show: true,
            notifications: [...state.notifications, notification],
        }))
    },
    notifications: [],
    removeNotification: (id) =>
        set((state) => {
            const notifications = state.notifications.filter((n) => n.id !== id)
            return { notifications, show: notifications.length > 0 }
        }),
    reset: () => set({ type: '', message: '', show: false, notifications: [] })
}))

export default useNotificationsStore