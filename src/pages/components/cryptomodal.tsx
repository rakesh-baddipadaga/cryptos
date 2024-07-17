import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setSymbol } from '../../../store/dataslice';
import styles from './cryptomodal.module.css'; 

interface CryptoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CryptoModal: React.FC<CryptoModalProps> = ({ isOpen, onClose }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const dispatch = useDispatch();

  const handleSubmit = () => {
    dispatch(setSymbol(selectedCrypto));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalBackdrop}>
      <div className={styles.modalContainer}>
        <h2>Change Crypto</h2>
        <div className={styles.formGroup}>
          <input
            type="text"
            value={selectedCrypto}
            onChange={(e) => setSelectedCrypto(e.target.value)}
            placeholder="Enter cryptocurrency symbol"
          />
        </div>
        <div className={styles.buttonGroup}>
          <button onClick={handleSubmit}>Submit</button>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default CryptoModal;