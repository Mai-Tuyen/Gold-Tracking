import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { devtools } from 'zustand/middleware'
type State = {
  typeChecked: 'SJL1L10' | 'PQHNVM' | 'DOHNL'
}

type Action = {
  setTypeChecked: (typeChecked: 'SJL1L10' | 'PQHNVM' | 'DOHNL') => void
}

export const useHomeStore = create<State & Action>()(
  devtools(
    immer((set) => ({
      // initial state
      typeChecked: 'SJL1L10',

      // actions
      setTypeChecked: (typeChecked) =>
        set((state) => {
          state.typeChecked = typeChecked
        })
    }))
  )
)
