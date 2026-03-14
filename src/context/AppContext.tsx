import {
  createContext,
  useContext,
  useMemo,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

export type FlowRouteKey = 'dashboard' | 'scan' | 'result'

export interface AppContextValue {
  readonly activeFlow: FlowRouteKey
  readonly setActiveFlow: Dispatch<SetStateAction<FlowRouteKey>>
  readonly lastScanSessionId?: string
  readonly setLastScanSessionId: Dispatch<SetStateAction<string | undefined>>
}

const AppContext = createContext<AppContextValue | undefined>(undefined)

export interface AppProviderProps {
  readonly children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  const [activeFlow, setActiveFlow] = useState<FlowRouteKey>('dashboard')
  const [lastScanSessionId, setLastScanSessionId] = useState<string | undefined>(undefined)

  const value = useMemo<AppContextValue>(
    () => ({
      activeFlow,
      setActiveFlow,
      lastScanSessionId,
      setLastScanSessionId,
    }),
    [activeFlow, lastScanSessionId],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useAppContext = (): AppContextValue => {
  const context = useContext(AppContext)

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider')
  }

  return context
}

