'use client';

import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5 w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-[#111111]"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#666666] text-sm">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            {...props}
            className={`
              w-full bg-white border rounded-lg py-2.5 text-[#111111] placeholder-[#AAAAAA]
              focus:outline-none focus:ring-2 transition-all duration-150
              ${leftIcon ? 'pl-10 pr-4' : 'px-4'}
              ${
                error
                  ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                  : 'border-[#E5E5E5] focus:ring-[#111111]/10 focus:border-[#111111]'
              }
              ${className}
            `}
          />
        </div>
        {error && <p className="text-xs text-red-500 flex items-center gap-1">⚠ {error}</p>}
        {hint && !error && <p className="text-xs text-[#666666]">{hint}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
