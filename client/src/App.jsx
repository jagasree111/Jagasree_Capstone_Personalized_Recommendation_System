import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import RecommendationCard from './components/RecommendationCard'

function App() {
  return (
    <>
      <Navbar />

      <main className="container">
        <h1>Welcome to Personalized Recommendation System</h1>

        <p>
          Discover personalized recommendations tailored to your interests.
        </p>

        <div className="cards">
          <RecommendationCard />
          <RecommendationCard />
          <RecommendationCard />
        </div>
      </main>

      <Footer />
    </>
  )
}

export default App