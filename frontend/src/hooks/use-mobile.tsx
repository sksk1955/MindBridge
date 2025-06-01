import * as React from "react"

const BREAKPOINTS = {
  MOBILE: 640,  // sm
  TABLET: 768,  // md
  DESKTOP: 1024 // lg
}

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < BREAKPOINTS.TABLET)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return isMobile
}
