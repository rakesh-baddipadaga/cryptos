import React, { useState } from 'react';
import CryptoTable from './components/cryptotable';
import CryptoModal from './components/cryptomodal';
import styles from '../pages/components/cryptotable.module.css'

console.log("Hello from index.tsx")

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <div className={styles.centered}> 
        <button onClick={openModal} className='btn'>Change Crypto</button>
      </div>
      <CryptoTable />
      <CryptoModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default HomePage;
