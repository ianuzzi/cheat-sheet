import Store from 'electron-store'

export type PersistedState = {
  alwaysOnTop: boolean
  lastTabId: string | null
  bounds: { x?: number; y?: number; width: number; height: number } | null
}

const defaults: PersistedState = {
  alwaysOnTop: false,
  lastTabId: null,
  bounds: null
}

export const store = new Store<PersistedState>({ defaults })
