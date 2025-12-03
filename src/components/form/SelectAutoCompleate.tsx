'use client';

import React, { useCallback, useState, useRef, useEffect } from 'react';
import AsyncSelect from 'react-select/async';
import { components, DropdownIndicatorProps } from 'react-select';
import { ChevronDownIcon } from "@/icons";

export interface Option {
  value: string | number;
  label: string;
}

export type LoadOptionsType = (
  inputValue: string,
  callback: (options: Option[]) => void
) => void | Promise<Option[]>;

interface SelectAutoCompleteAsyncProps {
  loadOptions: LoadOptionsType;
  placeholder?: string;
  onChange: (value: Option | null) => void;
  className?: string;
  defaultValue?: Option | null;
  defaultOptions?: Option[] | boolean;
  value?: Option | null;
  disabled?: boolean;
  success?: boolean;
  error?: boolean;
  hint?: string;
  id?: string;
  debounceTimeout?: number;
}

const DropdownIndicator = (props: DropdownIndicatorProps<Option, false>) => {
  return (
    <components.DropdownIndicator {...props}>
      <span className="text-gray-500 dark:text-gray-400">
        <ChevronDownIcon />
      </span>
    </components.DropdownIndicator>
  );
};

export default function SelectAutoCompleteAsync({
  loadOptions,
  placeholder = "Select option",
  onChange,
  className = "",
  defaultValue = null,
  value,
  defaultOptions = false,
  disabled = false,
  success = false,
  error = false,
  hint,
  id,
  debounceTimeout = 500
}: SelectAutoCompleteAsyncProps) {

  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const [internalValue, setInternalValue] = useState<Option | null>(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); 
  const isControlled = value !== undefined;
  const finalValue = isControlled ? value : internalValue;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []); 

  const handleChange = useCallback((option: Option | null) => {
    if (!isControlled) {
      setInternalValue(option);
    }
    if (onChange) {
      onChange(option);
    }
  }, [isControlled, onChange]);

  const debouncedLoadOptions = (inputValue: string, callback: (options: Option[]) => void) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      const result = loadOptions(inputValue, callback);
      
      if (result instanceof Promise) {
        const options = await result;
        callback(options);
      }
    }, debounceTimeout);
  };

  const baseControlClasses = "flex items-center justify-between w-full min-h-[3rem] rounded-lg border bg-transparent px-4 py-2 text-sm shadow-theme-xs transition-colors focus-within:ring-3 focus-within:outline-none";
  
  let stateClasses = "";
  if (disabled) {
    stateClasses = "border-gray-300 bg-gray-100 opacity-40 cursor-not-allowed dark:bg-gray-800 dark:border-gray-700";
  } else if (error) {
    stateClasses = "border-error-500 focus-within:border-error-300 focus-within:ring-error-500/20 dark:border-error-500 dark:focus-within:border-error-800";
  } else if (success) {
    stateClasses = "border-success-500 focus-within:border-success-300 focus-within:ring-success-500/20 dark:border-success-500 dark:focus-within:border-success-800";
  } else {
    stateClasses = "border-gray-300 text-gray-800 hover:border-gray-400 focus-within:border-brand-300 focus-within:ring-brand-500/20 dark:border-gray-700 dark:text-white/90 dark:focus-within:border-brand-800 dark:bg-gray-900";
  }

  // Jika belum mounted, tampilkan placeholder dengan tinggi yang sama
  if (!isMounted) {
    return (
      <div className={`relative ${className}`}>
        <div className={`w-full h-11 rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse ${stateClasses.includes('border-') ? stateClasses.split(' ').filter(c => c.startsWith('border-'))[0] : ''}`} />
        {hint && <p className="mt-1.5 text-xs text-transparent select-none">placeholder hint</p>}
      </div>
    );
  }


  return (
    <div className={`relative ${className}`}>
      <AsyncSelect
        inputId={id}
        cacheOptions
        defaultOptions={defaultOptions}
        loadOptions={debouncedLoadOptions} 
        placeholder={placeholder}
        value={finalValue}
        onChange={handleChange}
        isClearable
        isDisabled={disabled}
        components={{ DropdownIndicator }}
        unstyled={true}
        classNames={{
          control: () => `${baseControlClasses} ${stateClasses}`,
          
          placeholder: () => "text-gray-400 dark:text-gray-400/50",
          
          input: () => "text-gray-800 dark:text-white/90",
          
          singleValue: () => {
             if (error) return "text-error-500";
             if (success) return "text-success-500";
             return "text-gray-800 dark:text-white/90";
          },
          
          menu: () => "absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900",
          
          option: ({ isFocused, isSelected }) => {
            let optClasses = "cursor-pointer px-4 py-2 text-sm transition-colors ";
            
            if (isSelected) {
              optClasses += "bg-brand-500 text-white dark:bg-brand-600 ";
            } else if (isFocused) {
              optClasses += "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-white ";
            } else {
              optClasses += "text-gray-700 dark:text-gray-300 ";
            }
            
            return optClasses;
          },
          
          indicatorsContainer: () => "gap-1",
          clearIndicator: () => "text-gray-400 hover:text-error-500 cursor-pointer p-1",
          dropdownIndicator: () => "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-pointer p-1",
          
          loadingMessage: () => "px-4 py-2 text-sm text-gray-500 dark:text-gray-400",
          noOptionsMessage: () => "px-4 py-2 text-sm text-gray-500 dark:text-gray-400",
        }}
      />
      
      {hint && (
        <p
          className={`mt-1.5 text-xs ${
            error
              ? "text-error-500"
              : success
              ? "text-success-500"
              : "text-gray-500"
          }`}
        >
          {hint}
        </p>
      )}
    </div>
  );
}