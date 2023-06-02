const StatItem = ({ title, count, icon }) => {
  return (
    <div className="stat-item">
      <header>
        <span className="count">{count}</span>
        <div className="icon">{icon}</div>
      </header>
      <h5 className="title">{title}</h5>
    </div>
  )
}

export default StatItem
