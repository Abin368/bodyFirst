import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { createContext } from 'react'
import { authStore } from './store/authStore.ts'
import React from 'react'
const StoreContext = createContext({authStore})
export const userStore =() =>React.useContext(StoreContext)

createRoot(document.getElementById('root')!).render(
  <StrictMode>

  <StoreContext.Provider value={{authStore}}>

   <BrowserRouter>
      <App />

    </BrowserRouter>

  </StoreContext.Provider>

   
    
  </StrictMode>,
)
