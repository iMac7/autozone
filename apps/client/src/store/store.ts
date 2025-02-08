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






// const useStore = create((set) => ({
//   bears: 0,
//   increasePopulation: () => set((state) => ({ bears: state.bears + 1 })),
//   removeAllBears: () => set({ bears: 0 }),
//   updateBears: (newBears) => set({ bears: newBears }),
// }))

// function BearCounter() {
//   const bears = useStore((state) => state.bears)
//   return <h1>{bears} around here...</h1>
// }

// function Controls() {
//   const increasePopulation = useStore((state) => state.increasePopulation)
//   return <button onClick={increasePopulation}>one up</button>
// }