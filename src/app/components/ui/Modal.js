'use client';

import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import styles from './Modal.module.css';
import { TextField, Button } from '@mui/material'

let colors={
    // White text color (what user types)
    '& .MuiInputBase-input': {
      color: 'white',
    },

    // White label (normal state)
    '& .MuiInputLabel-root': {
      color: 'white',
    },

    // White label when focused / shrunk
    '& .MuiInputLabel-root.Mui-focused': {
      color: 'white',
    },

    // White border (outlined variant)
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    },

    '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#aaaaaa',
    },

    // White border when focused
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: 'white',
    }

    // Optional: make focused ring / glow white too (if you want stronger focus indicator)
    // '& .MuiOutlinedInput-root.Mui-focused': {
    //   boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)',
}


export default function Modal({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  message, 
  link, 
  userCode, 
  handleChange,
  handleSubmit
}) {
  
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <>
      {/* Backdrop – blurs everything behind */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Modal content */}
      <div className={styles.modal}>
        {title && (
          <div className={styles.header}>
            <h2>{title}</h2>
            <button className={styles.closeBtn} onClick={onClose}>
              ×
            </button>
            
          </div>
        )}

        {message && (
          <div className={styles.message}>
            {message}
          </div>
        )}

        {link && (
          <div className={styles.link}>
            <a href="https://calendly.com/its-about-time" target="_blank" rel="noopener noreferrer">{link}</a>
          </div>
        )}

        <p className={styles.or}>OR</p>

        <div className={styles.input}>
          <TextField 
            className={styles.input}
            id="outlined-basic" 
            label="Verification Code" 
            variant="outlined"
            // sx={formStyle}
            required
            type="text"
            name="name"
            value={userCode}
            onChange={handleChange}
            placeholder='Please Enter Your Code'
            fullWidth
            sx={colors}
            />
          </div>

          <div className={styles.button}>
          <Button
            variant="outlined"
            color="inherit"
            onClick={handleSubmit}
            >Submit</Button>
            </div>

        <div className={styles.content}>{children}</div>
      </div>
    </>,
    document.body
  );
}