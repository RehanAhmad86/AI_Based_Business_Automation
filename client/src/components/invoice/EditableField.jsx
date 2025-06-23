import React, { useState, useRef, useEffect } from 'react';
import { Edit } from 'lucide-react';

const EditableField = ({ value, onChange, className, placeholder, type = 'text' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTempValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="relative">
        {type === 'textarea' ? (
          <textarea
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            placeholder={placeholder}
            rows={3}
          />
        ) : (
          <input
            ref={inputRef}
            type={type}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleSave}
            className={`w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
            placeholder={placeholder}
          />
        )}
      </div>
    );
  }

  return (
    <div 
      className={`group relative cursor-pointer ${className}`}
      onClick={() => setIsEditing(true)}
    >
      <div className={`${!value && 'text-gray-400'}`}>
        {value || placeholder}
      </div>
      <button 
        className="absolute -right-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.stopPropagation();
          setIsEditing(true);
        }}
      >
        <Edit size={16} className="text-gray-500 hover:text-gray-700" />
      </button>
    </div>
  );
};

export default EditableField;