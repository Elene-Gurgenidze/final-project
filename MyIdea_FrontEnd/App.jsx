import { useEffect, useState } from 'react'
import AdminPage from './src/AdminPage'

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
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <header className="page-header">
        <h1>My Idea</h1>
        <p className="page-subtitle">სამოგზაურო მიმართულებები</p>
      </header>
      {error && <p style={{ color: 'red' }}>შეცდომა: {error}</p>}

      {health && (
        <p style={{ fontSize: '14px', color: '#666' }}>
          API: {health.status} · Database: {health.database}
        </p>
      )}

      {loading && <p>იტვირთება...</p>}

      {!loading && !error && (
        <>
          <h2>მიმართულებების სია</h2>

          {destinations.length === 0 ? (
            <p>მიმართულებები ჯერ დამატებული არ არის.</p>
          ) : (
            /* ბარათების ბადე (Grid) */
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '20px',
              marginTop: '20px'
            }}>
              {destinations.map((destination) => (
                <div
                  key={destination._id}
                  style={{
                    border: '1px solid #ddd',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                    backgroundColor: '#fff',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {/* სურათი */}
                  {destination.image && (
                    <img
                      src={destination.image}
                      alt={destination.name}
                      style={{
                        width: '100%',
                        height: '180px',
                        objectFit: 'cover'
                      }}
                    />
                  )}

                  {/* ბარათის შიგთავსი */}
                  <div style={{ padding: '15px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{destination.name}</h3>
                    <p style={{ margin: '0 0 8px 0', color: '#555', fontWeight: 'bold' }}>
                      📍 {destination.city}, {destination.country}
                    </p>
                    <p style={{ margin: '0 0 15px 0', color: '#777', fontSize: '14px', flexGrow: 1 }}>
                      {destination.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                      <span style={{ color: '#007bff', fontWeight: 'bold' }}>
                        კატეგორია: {destination.category}
                      </span>
                      <span style={{ backgroundColor: '#ffc107', padding: '3px 8px', borderRadius: '5px', fontSize: '12px', fontWeight: 'bold' }}>
                        ⭐ {destination.rating}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
      <AdminPage />

    </main>
  )
}

export default App