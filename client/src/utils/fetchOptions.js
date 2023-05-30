const fetchOptions = ({ method='POST', body={}, authorization='' }) => {
    let options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    }
    if(method === 'POST' || method ==='PATCH') {
        options.body = body
    }
    if(authorization) {
        options.headers['Authorization'] = authorization
    }

    return options
}

export default fetchOptions
