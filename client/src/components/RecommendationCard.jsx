function RecommendationCard({ title, description }) {
  return (
    <div className="recommendation-card">
      <h3>{title}</h3>
      <p>{description}</p>
      <button>View Recommendation</button>
    </div>
  );
}

export default RecommendationCard;