import React, { useEffect, useState } from 'react'
import ResizeObserver from 'resize-observer-polyfill'

const useResizeObserver = (ref: React.MutableRefObject<Element>) => {
  const [dimensions, setDimensions] = useState<DOMRectReadOnly>()
  useEffect(() => {
    const observeTarget = ref.current
    const resizeObserver = new ResizeObserver(
      (entries: ResizeObserverEntry[]) => {
        entries.forEach((entry) => {
          setDimensions(entry.contentRect as DOMRectReadOnly) 
        })
      }
    )
    resizeObserver.observe(observeTarget)
    return () => {
      resizeObserver.unobserve(observeTarget)
    }
  }, [ref])
  return dimensions
}

export default useResizeObserver
