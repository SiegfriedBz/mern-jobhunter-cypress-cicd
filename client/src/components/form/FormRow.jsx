const FormRow = (props) => {
    const {
        name,
        type,
        value,
        autoComplete,
        handleChange,
        required,
        labelText
    } = props
    return (
        <div className="form-row">
            <label htmlFor={name} className='form-label'>{labelText}</label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                autoComplete={autoComplete}
                onChange={handleChange}
                className='form-input'
                required={required}
            />
        </div>
    )
}
export default FormRow
