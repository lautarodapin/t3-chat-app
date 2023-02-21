import React, {useEffect} from 'react'

export const Loading: React.FC = () => {
    const [value, setValue] = React.useState(0)

    useEffect(() => {
        const interval = setInterval(() => {
            setValue(v => v >= 100 ? 0 : v + 1)
        }, 10)
        return () => {
            clearInterval(interval)
        }
    }, [])

    return <div
        className="radial-progress"
        style={{'--value': value}}
    />
}