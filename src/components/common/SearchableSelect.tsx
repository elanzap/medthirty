import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  label,
  required = false,
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find(option => option.value === value);

  const handleSelect = (option: Option) => {
    onChange(option.value);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div className={`relative ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div ref={wrapperRef} className="relative">
        <div
          className="relative w-full cursor-default"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen && inputRef.current) {
              inputRef.current.focus();
            }
          }}
        >
          <div className="w-full flex items-center justify-between border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white">
            {isOpen ? (
              <input
                ref={inputRef}
                type="text"
                className="block w-full border-0 p-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <span className={`block truncate ${!selectedOption ? 'text-gray-500' : 'text-gray-900'}`}>
                {selectedOption ? selectedOption.label : placeholder}
              </span>
            )}
            <div className="flex items-center">
              {value && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-500 mr-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'transform rotate-180' : ''}`} />
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-2 text-sm text-gray-500">No options found</div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`cursor-pointer select-none relative py-2 pl-3 pr-9 text-sm hover:bg-indigo-50 ${
                      option.value === value ? 'bg-indigo-50' : ''
                    }`}
                    onClick={() => handleSelect(option)}
                  >
                    <span className={`block truncate ${option.value === value ? 'font-semibold' : 'font-normal'}`}>
                      {option.label}
                    </span>
                    {option.value === value && (
                      <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
