import { useEffect } from 'react';

export const hideGlobalLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.display = 'none';
  }
};

export const showGlobalLoader = () => {
  const loader = document.querySelector('.loader');
  if (loader) {
    loader.style.display = 'block';
  }
};

const Loader = () => {
  useEffect(() => {
    showGlobalLoader();
    return hideGlobalLoader;
  }, []);
  return null;
};

export default Loader;
