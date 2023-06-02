import { useState } from 'react'
import { useAppContext } from '../contextAPI/context'
import { useFetchUserHook } from '../hooks'
import Logo from '../components/utils/Logo'
import FormRow from '../components/form/FormRow'
import FlashMessage from '../components/utils/FlashMessage'

const initFormState = {
  name: '',
  email: '',
  password: '',
  showLoginForm: true,
}

function Register() {
  const { createUser, getUser } = useFetchUserHook()

  const { flash, setIsLoading, clearIsLoading, setFlash } = useAppContext()

  const [formValues, setFormValues] = useState(initFormState)

  // toggle between login and register
  const toggleShowLoginForm = () => {
    setFormValues({ ...formValues, showLoginForm: !formValues.showLoginForm })
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormValues({ ...formValues, [name]: value })
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    const { name, email, password, showLoginForm } = formValues

    if (!email || !password || (!name && !showLoginForm)) {
      setFlash({ type: 'danger', message: 'Please fill all fields' })
      return
    }

    setFormValues(initFormState)

    try {
      setIsLoading()

      if (showLoginForm) {
        await getUser(email, password)
      } else {
        await createUser(name, email, password)
      }

      clearIsLoading()
    } catch (error) {
      clearIsLoading()
      setFlash({ type: 'danger', message: error.message })
    }
  }

  return (
    <div className="register full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{formValues.showLoginForm ? 'Login' : 'Register'}</h3>
        {flash?.showFlash && <FlashMessage />}
        {formValues.showLoginForm ? null : (
          <FormRow
            name="name"
            type="name"
            value={formValues.name}
            autoComplete="username"
            handleChange={handleChange}
          />
        )}
        <FormRow
          name="email"
          type="email"
          value={formValues.email}
          autoComplete="username"
          handleChange={handleChange}
        />
        <FormRow
          name="password"
          type="password"
          value={formValues.password}
          autoComplete="current-password"
          handleChange={handleChange}
        />
        <button type="submit" className="btn btn-block">
          Submit
        </button>
        <span>
          {formValues.showLoginForm
            ? 'Not a member yet? please'
            : 'Already a member ? please'}
        </span>
        <button
          type="button"
          onClick={toggleShowLoginForm}
          className="member-btn"
        >
          {' '}
          {formValues.showLoginForm ? 'Register' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default Register
