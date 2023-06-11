import { ConfigProvider, theme } from 'antd';
import { useEffect, useState } from 'react';

import { CCACanvas } from './cca-cpu/CCACanvas';
import { CCAReact } from './cca-cpu/CCAReact';
import { CCAReactBroken } from './cca-cpu/CCAReactBroken';
import { CCAGpu } from './cca-gpu/CCAGpu';
import { CCAGpuPbr } from './cca-gpu/CCAGpuPbr';
import { CCAREACT_DEFAULTS_1 } from './lib/presentation-defaults';

function App() {
  const [page, setPage] = useState(0);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === 'ArrowLeft') {
      setPage((prev) => Math.max(prev - 1, 0));
    }
    if (e.key === 'ArrowRight') {
      setPage((prev) => Math.min(prev + 1, 4));
    }
  }

  return (
    <ConfigProvider
      theme={{
        algorithm: [theme.darkAlgorithm],
      }}
    >
      {/* The Broken CCA Implementation for reference */}
      {page === 0 && <CCAReactBroken />}

      {/* The React/HTML CCA Implementation */}
      {page === 1 && <CCAReact {...CCAREACT_DEFAULTS_1} />}

      {/* The Canvas2D CCA Implementation */}
      {page === 2 && <CCACanvas />}

      {/* The GPU CCA Implementation */}
      {page === 3 && <CCAGpu />}

      {/* The GPU CCA Implementation with PBR Shading */}
      {page === 4 && <CCAGpuPbr />}
    </ConfigProvider>
  );
}

export default App;
