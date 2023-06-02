const JobInfo = ({ icon, text }) => {
  return (
    <div className="job-info">
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </div>
  )
}

export default JobInfo
