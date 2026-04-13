import { create } from "zustand"
import { User } from "../../services/auth/userService"

interface UserInfoStore {
    user: User | null
    setUser: (user: User | null) => void
}

const useUserInfoStore = create<UserInfoStore>((set) => ({
    user: null,
    setUser: (user) => set({ user }),
}))

export default useUserInfoStore