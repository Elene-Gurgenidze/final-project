import { useEffect, useState } from 'react'

const API_URL = import.meta.env.VITE_API_URL

function App() {
  const [health, setHealth] = useState(null)
  const [error, setError] = useState('')
  const[products, setProducts] = useState([])
  useEffect(() => {
    fetch(`${API_URL}/health`)
      .then((res) => res.json())
      .then(setHealth)
      .catch((err) => setError(err.message))
  }, [])

 	useEffect(() => {
		fetch(`${API_URL}/api/products`)
			.then((res) => res.json())
			.then(setProducts)
			.catch((err) => setError(err.message));
	}, []);
  return (
    <main>
      <h1>My Idea</h1>
      {error && <p>Could not reach the API: {error}</p>}
      {!health && !error && <p>Checking the server...</p>}
      {health && (
        <p>
          API: {health.status} · Database: {health.database}
        </p>
      )}
     <ul>
				{products.map((p) => (
					<li key={p._id}>
						{p.title} · ${p.price}
					</li>
				))}
			</ul>
    </main>
  )
}

export default App