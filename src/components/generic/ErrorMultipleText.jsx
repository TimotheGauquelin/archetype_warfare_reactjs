import React from 'react'

const ErrorMultipleText = ({ multipleErrors }) => {
    return (
        <div className="col-span-12 mt-4 p-2 bg-red-100 text-red-500 rounded mb-1">
            {typeof multipleErrors === 'string' && multipleErrors.includes('\n') 
            ? (
                multipleErrors.split('\n').map((line, index) => (
                    <p key={index} className="mb-1">
                        {line.trim()}
                    </p>
                ))
            ) 
            : (
                <p>{multipleErrors}</p>
            )}
        </div>
    )
}

export default ErrorMultipleText