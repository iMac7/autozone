import { create } from 'zustand'

type State = {
  user_address: `0x${string}` | undefined
  lens_address: string | undefined
}

type Action = {
  updateUserAddress: (firstName: State['user_address']) => void
  updateLensAddress: (lastName: State['lens_address']) => void
}

export const useCredentialStore = create<State & Action>((set) => ({
  user_address: undefined,
  lens_address: localStorage.getItem('lens_account') || undefined,
  updateUserAddress: (newAddress: `0x${string}` | undefined) => set(() => ({ user_address: newAddress })),
  updateLensAddress: (newAddress: string | undefined) => set(() => ({ lens_address: newAddress })),
}))

