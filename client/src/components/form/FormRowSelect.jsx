const FormRowSelect = (props) => {
    const {
            name,
            labelText,
            options,
            value,
            handleChange
    } = props
    return (
        <div>
            <label htmlFor={name} className='form-label'>{labelText}</label>
            <select
                name={name}
                id={name}
                onChange={handleChange}
                className="form-select"
                value={value}
            >
                {options?.map((option, index) => {
                    return <option key={index} value={option}>{option}</option>
                })}
            </select>
        </div>
    )
}
export default FormRowSelect
