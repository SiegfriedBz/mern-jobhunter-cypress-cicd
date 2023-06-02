import { useState } from 'react'
import { useAppContext, useUserContext } from '../../contextAPI/context'
import { useFetchUserHook } from '../../hooks'
import FormRow from '../../components/form/FormRow'
import FlashMessage from '../../components/utils/FlashMessage'

const Profile = () => {
  const { updateUser } = useFetchUserHook()

  // context
  const { isLoading, flash, setIsLoading, clearIsLoading, setFlash } =
    useAppContext()
  const { user } = useUserContext()

  // component state
  const [formValues, setFormValues] = useState(user)

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'address') {
      setFormValues((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          address: value,
        },
      }))
    } else {
      setFormValues((prev) => ({ ...prev, [name]: value }))
    }
  }

  // eslint-disable-next-line consistent-return
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formValues?.email || !formValues?.name) {
      return setFlash({
        type: 'danger',
        message: 'Email and name can not be blank',
      })
    }

    if (formValues?.location?.address?.trim() === '') {
      return setFlash({ type: 'danger', message: 'Address can not be blank' })
    }

    try {
      setIsLoading()

      let updateUserObject = {}

      // update user object except location
      Object.keys(formValues)
        .filter((key) => key !== 'location')
        .forEach((key) => {
          updateUserObject[key] = formValues[key]
          return updateUserObject
        })

      // update user object location
      const updatedUserAddress =
        formValues.location.address.trim() !== ''
          ? formValues.location.address.trim()
          : user.location.address
      updateUserObject = {
        ...updateUserObject,
        location: {
          ...formValues.location,
          address: updatedUserAddress,
        },
      }

      await updateUser(updateUserObject)

      clearIsLoading()
    } catch (error) {
      clearIsLoading()
    }
  }

  return (
    <div className="dashboard-form-page">
      {flash?.showFlash && <FlashMessage />}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-center">
          <FormRow
            name="name"
            type="text"
            value={formValues.name}
            autoComplete="username"
            handleChange={handleChange}
          />
          <FormRow
            name="lastName"
            type="text"
            value={formValues.lastName}
            autoComplete="username"
            handleChange={handleChange}
          />
          <FormRow
            name="email"
            type="email"
            value={formValues.email}
            autoComplete="username"
            handleChange={handleChange}
            required
          />
          <FormRow
            name="password"
            type="password"
            value={formValues.password}
            autoComplete="current-password"
            handleChange={handleChange}
          />
          <FormRow
            name="address"
            type="text"
            value={formValues.location.address}
            handleChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Submit
        </button>
      </form>
    </div>
  )
}

export default Profile
