import React from 'react';

export default function({ children, isOpen }) {
  if (isOpen)
    return (
      <div className="modal-overlay">
        { children }
      </div>
    )
  return null;
}
