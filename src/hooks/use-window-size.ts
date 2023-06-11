import { useEffect, useState } from 'react';

import { Size } from '../model/model';


// This hook returns the current window size and updates it on resize.
export function useWindowSize(): Size {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    window.addEventListener('resize', onResize);

    function onResize(): void {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }

    return function dispose(): void {
      window.removeEventListener('resize', onResize);
    };
  });

  return size;
}
