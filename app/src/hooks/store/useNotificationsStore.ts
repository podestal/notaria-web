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
    notify: (type: string, message: string) => void
    notifications: NotificationItem[]
    removeNotification: (id: string) => void
    reset: () => void
}

const PATCH_WINDOW_MS = 160

const createNotification = (type: string, message: string): NotificationItem | null => {
    const trimmed = message.trim()
    if (!trimmed) return null

    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: type || "info",
        message: trimmed,
    }
}

const patchRecentNotification = (
    notifications: NotificationItem[],
    patch: Partial<NotificationItem>,
): NotificationItem[] => {
    const now = Date.now()
    let patchIndex = -1

    for (let i = notifications.length - 1; i >= 0; i -= 1) {
        const timestamp = Number(notifications[i].id.split("-")[0])
        if (now - timestamp <= PATCH_WINDOW_MS) {
            patchIndex = i
            break
        }
    }

    if (patchIndex === -1) return notifications

    return notifications.map((notification, index) =>
        index === patchIndex ? { ...notification, ...patch } : notification,
    )
}

const useNotificationsStore = create<NotificationsState>((set, get) => ({
    type: "",
    setType: (value) =>
        set((state) => ({
            type: value,
            notifications: patchRecentNotification(state.notifications, { type: value }),
        })),
    message: "",
    setMessage: (value) =>
        set((state) => ({
            message: value,
            notifications: patchRecentNotification(state.notifications, { message: value.trim() }),
        })),
    show: false,
    setShow: (val) => {
        if (!val) {
            set((state) => ({ show: false, notifications: state.notifications }))
            return
        }

        const { type, message } = get()
        const notification = createNotification(type, message)
        if (!notification) return

        set((state) => ({
            show: true,
            notifications: [...state.notifications, notification],
        }))
    },
    notify: (type, message) => {
        const notification = createNotification(type, message)
        if (!notification) return

        set((state) => ({
            type,
            message: notification.message,
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
    reset: () => set({ type: "", message: "", show: false, notifications: [] }),
}))

export default useNotificationsStore
