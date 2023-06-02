const loader = (
  <div className="spinner-grow text-info mx-3" role="status">
    <span className="visually-hidden" />
  </div>
)

const Loading = () => {
  return (
    <div className="d-flex flex-row justify-content-center align-items-center">
      {Array(3)
        .fill(loader)
        .map((item, index) => {
          // eslint-disable-next-line react/no-array-index-key
          return <div key={index}>{item}</div>
        })}
    </div>
  )
}

export default Loading
