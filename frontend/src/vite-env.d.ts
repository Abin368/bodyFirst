/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PUBLIC_STRIPE_PRICE_BASIC: string
    readonly VITE_STRIPE_PRICE_PRO: string
    readonly VITE_STRIPE_PRICE_ENTERPRISE: string
    readonly VITE_API_URL?: string 
    
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
