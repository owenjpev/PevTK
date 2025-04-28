function Input({ label, id, type = "text", placeholder }) {
    return (
        <div className="form-group">
            {label && <label className="form-label">{label}</label>}
            <input
                id={id}
                type={type}
                placeholder={placeholder}
                className="form-input"
            />
        </div>
    );
}

export default Input;