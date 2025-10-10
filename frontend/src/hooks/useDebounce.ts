import { useState, useEffect } from 'react'

function useDebounce<T>(value: T, delay: number = 300): T {
  const [debouncedValue, setDeboucedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDeboucedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
