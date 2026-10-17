
import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')
  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        setError('')

        // ვამოწმებთ Backend-ის მუშაობას
        const healthResponse = await fetch(`${API_URL}/health`)

        if (!healthResponse.ok) {
          throw new Error('სერვერთან დაკავშირება ვერ მოხერხდა')
        }

        const healthData = await healthResponse.json()
        setHealth(healthData)

        // ვიღებთ სამოგზაურო მიმართულებებს
        const destinationsResponse = await fetch(
          `${API_URL}/api/destinations`
        )

        if (!destinationsResponse.ok) {
          throw new Error('მიმართულებების ჩატვირთვა ვერ მოხერხდა')
        }

        const destinationsData = await destinationsResponse.json()
        setDestinations(destinationsData)
      } catch (err) {
        setError(err.message || 'უცნობი შეცდომა')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <main>
      <h1>My Idea</h1>

      {error && <p>შეცდომა: {error}</p>}

      {health && (
        <p>
          API: {health.status} · Database: {health.database}
        </p>
      )}

      {loading && <p>იტვირთება...</p>}

      {!loading && !error && (
        <>
          <h2>სამოგზაურო მიმართულებები</h2>

          {destinations.length === 0 ? (
            <p>მიმართულებები ჯერ დამატებული არ არის.</p>
          ) : (
            <ul>
              {destinations.map((destination) => (
                <li key={destination._id}>
                  <h3>{destination.name}</h3>
                  <p>
                    {destination.city}, {destination.country}
                  </p>
                  <p>{destination.description}</p>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </main>
  )
}

export default App
