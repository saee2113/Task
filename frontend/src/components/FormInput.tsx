import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    helperText?: string;
}

const FormInput: React.FC<FormInputProps> = ({
    label,
    error,
    helperText,
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const hasError = !!error;

    return (
        <div className="space-y-1">
            <label 
                htmlFor={inputId}
                className="block text-sm font-medium text-gray-700"
            >
                {label}
            </label>
            <input
                id={inputId}
                className={`
                    block w-full rounded-md shadow-sm
                    focus:ring-2 focus:ring-offset-2
                    disabled:bg-gray-50 disabled:text-gray-500
                    ${hasError 
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                        : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                    }
                    ${className}
                `}
                {...props}
            />
            {(error || helperText) && (
                <p className={`text-sm ${hasError ? 'text-red-600' : 'text-gray-500'}`}>
                    {error || helperText}
                </p>
            )}
        </div>
    );
};

export default FormInput;
