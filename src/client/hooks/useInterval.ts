import { useEffect } from "react"

function useInterval(callback: () => void, delay: number) {
  // Set up the interval.
  useEffect(() => {
    function tick() {
      return callback()
    }
      const id = setInterval(tick, delay)
      return () => clearInterval(id)
  }, [callback, delay])
}

export default useInterval