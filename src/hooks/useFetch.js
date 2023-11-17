import { useState, useEffect, useRef } from 'react'

export const useFetch = (url, _options) => {
    const [data, setData] = useState(null)
    const [isPending, setIsPending] = useState(false)
    const [error, setError] = useState(null)

    const options = useRef(_options).current

    useEffect(() => {
        const controller = new AbortController()

        const fetchData = async () => {
            setIsPending(true)
            setError(null) // set null here also so that when loading, it removes the prev err.

            try {
                const res = await fetch(url, { signal: controller.signal })
                //if url is invalid, we will still get a response.
                //The below code is to catch those kind of errors.
                if (!res.ok) {
                    throw new Error(res.statusText) //statusText is from the response obj.
                }
                const json = await res.json()
                setError(null)
                setData(json)
            } catch (err) {
                if (err.name === "AbortError") {
                } else {
                    setError('Could not fetch data.')
                }
            }

            setIsPending(false)
        }
        fetchData()

        return () => {
            controller.abort()
        }
    }, [url, options])
    
    return { data, isPending, error }
}
