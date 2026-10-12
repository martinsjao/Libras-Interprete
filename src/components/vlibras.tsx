'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, type HTMLAttributes } from 'react';

declare global {
  interface Window {
    VLibras?: {
      Widget: new (rootPath?: string) => void;
    };
  }
}

const ROOT = 'https://vlibras.gov.br/app';
const SCRIPT = `${ROOT}/vlibras-plugin.js`;

function iniciarWidget() {
  if (typeof window === 'undefined' || !window.VLibras?.Widget) return;

  const jaAtivo = document.querySelector('[vw] .vw-access-button img, [vw-access-button].active img');
  if (jaAtivo) return;

  try {
    new window.VLibras.Widget(ROOT);
  } catch {
    // Widget já pode existir após navegação no App Router.
  }

  // Alguns builds do plugin esperam o evento load da página.
  window.dispatchEvent(new Event('load'));
}

export default function VLibras() {
  const pathname = usePathname();
  const scriptPronto = useRef(false);

  useEffect(() => {
    if (!scriptPronto.current) return;
    iniciarWidget();
  }, [pathname]);

  return (
    <>
      <div
        data-vlibras-root
        {...({ vw: 'true', className: 'enabled' } as HTMLAttributes<HTMLDivElement>)}
      >
        <div
          {...({
            'vw-access-button': 'true',
            className: 'active',
          } as HTMLAttributes<HTMLDivElement>)}
        />
        <div {...({ 'vw-plugin-wrapper': 'true' } as HTMLAttributes<HTMLDivElement>)}>
          <div className="vw-plugin-top-wrapper" />
        </div>
      </div>
      <Script
        src={SCRIPT}
        strategy="afterInteractive"
        onLoad={() => {
          scriptPronto.current = true;
          iniciarWidget();
        }}
      />
    </>
  );
}
