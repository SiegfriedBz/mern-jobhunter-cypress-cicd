const fetchOptions = ({ method = 'POST', body = {}, authorization = '' }) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }
  if (method === 'POST' || method === 'PATCH') {
    options.body = body
  }
  if (authorization) {
    options.headers.Authorization = authorization
  }

  return options
}

export default fetchOptions
