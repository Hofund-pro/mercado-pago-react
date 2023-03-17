import { useEffect, useState } from "react"

const useScript = (url: string) => {
  const [loaded, setLoaded] = useState(false)
  useEffect(() => {
    const existingScript = document.querySelector(`[src="${url}"]`)
    
    if (existingScript) {
      setLoaded(true)
    } else {
      const script = document.createElement("script")
      script.src = url
      script.async = true
      script.onload = () => {
        setLoaded(true)
      }
      
      document.body.appendChild(script)
    }
  }, [url])
  
  return {
    loaded
  }
}

export default useScript;