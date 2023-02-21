import React from 'react'

export const useOnScreen = <T extends Element | null>(ref: React.MutableRefObject<T>, rootMargin = "0px") => {
    // State and setter for storing whether element is visible
    const [isIntersecting, setIntersecting] = React.useState<boolean>(false)
    React.useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry) return
                // Update our state when observer callback fires
                setIntersecting(entry.isIntersecting)
            },
            {
                rootMargin,
            }
        )
        if (ref.current) {
            observer.observe(ref.current)
        }
        return () => {
            ref.current && observer.unobserve(ref.current)
        }
    }, [rootMargin, ref])
    return isIntersecting
}
