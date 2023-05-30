import React from 'react'

const loader =
    <div className="spinner-grow text-info mx-3" role="status">
        <span className="visually-hidden"></span>
    </div>

const Loading = () => {
    return (
        <>
            <div className="d-flex flex-row justify-content-center align-items-center">
                {Array(3)
                    .fill(loader)
                    .map((item, index) => {
                        return <div key={index}>{item}</div>
                    })}
            </div>
        </>
    )
}
export default Loading
