import { useEffect } from 'react';

export const useNetwork = () => {
  const checkNetwork = () => {
    if (window.ethereum.networkVersion !== '4') {
      return (
        <div className="bg-slate-900 w-full p-4 text-red-500 text-2xl">
          Please connect to Rinkeby network
        </div>
      );
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      });
    }
  });

  return { checkNetwork };
};
