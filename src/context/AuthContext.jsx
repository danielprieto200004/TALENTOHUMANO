import { createContext, useContext, useState } from 'react'

// Cambia esta contraseña según necesites
const EDITOR_PASSWORD = 'th2026'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [isEditor, setIsEditor] = useState(false)

  function login(password) {
    if (password === EDITOR_PASSWORD) {
      setIsEditor(true)
      return true
    }
    return false
  }

  function logout() {
    setIsEditor(false)
  }

  return (
    <AuthContext.Provider value={{ isEditor, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
