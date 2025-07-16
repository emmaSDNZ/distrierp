import React from "react";

export default function FormInput({
  type = "text",
  label,
  id,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  onDoubleClick,
  className = "",
  readOnly,
  autoFocus,
  ...restProps // para cualquier otro prop extra
}) {
  const baseInputClasses =
    "w-full border-b-2 border-transparent py-2 px-3 text-gray-900 " +
    "focus:outline-none focus:border-blue-600 hover:border-blue-300 " +
    "transition-colors duration-300 placeholder:text-gray-400 disabled:cursor-not-allowed disabled:bg-gray-100";

  return (
    <div className="mb-5">
      {label && (
        <label
          htmlFor={id}
          className="block mb-1 text-sm font-normal text-gray-700 select-none"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
        onDoubleClick={onDoubleClick}
        autoFocus={autoFocus}
        className={`${baseInputClasses} ${className}`}
        {...restProps}
      />
    </div>
  );
}
