import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RecommendationCard from './components/RecommendationCard'

function App() {
  const [recommendations, setRecommendations] = useState([])

  const fetchRecommendations = async () => {
    try {
      const response = await fetch(
        'http://localhost:5000/recommendations'
      )

      const data = await response.json()

      setRecommendations(data)
    } catch (error) {
      console.error('Failed to fetch recommendations:', error)
    }
  }

  useEffect(() => {
    fetchRecommendations()
  }, [])

  return (
    <>
      <Navbar />

      <main className="container">
        <h1>Welcome to Personalized Recommendation System</h1>

        <p>
          Discover personalized recommendations tailored to your interests.
        </p>

        <div className="cards">
          {recommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation._id}
              recommendation={recommendation}
              onUpdate={fetchRecommendations}
            />
          ))}
        </div>
      </main>

      <Footer />
    </>
  )
}

export default App