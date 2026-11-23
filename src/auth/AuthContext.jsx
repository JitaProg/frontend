import { createContext, useContext, useEffect, useSyncExternalStore } from 'react'
import { createWebSession } from './refreshLock'

const AuthContext = createContext(null)
const webSession = createWebSession(window)

export function AuthProvider({ children }) {
  const state = useSyncExternalStore(webSession.subscribe, webSession.getSnapshot)
  useEffect(webSession.start, [])
  return (
    <AuthContext.Provider value={{
      ...state, login: webSession.login, logout: () => webSession.logout(state.sessionEpoch), retrySession: webSession.refresh,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
