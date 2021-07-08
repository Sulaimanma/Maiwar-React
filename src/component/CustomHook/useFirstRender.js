import { useRef, useEffect } from "react"

export function useFirstRender() {
  const firstRender = useRef(1)

  useEffect(() => {
    firstRender.current = firstRender.current + 1
  }, [])

  return firstRender.current
}
