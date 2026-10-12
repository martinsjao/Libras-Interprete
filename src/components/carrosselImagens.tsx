'use client';

import Image from 'next/image';
import { ChevronLeft, ChevronRight, ImagesIcon } from 'lucide-react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { slidesCarrossel, type SlideCarrossel } from '@/src/data/carrossel';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';

const INTERVALO_PADRAO_MS = 9000;
const TRANSICAO_MS = 1000;

export default function CarrosselImagens({
  slides = slidesCarrossel,
  intervaloMs = INTERVALO_PADRAO_MS,
  className,
  children,
}: {
  slides?: SlideCarrossel[];
  intervaloMs?: number;
  className?: string;
  children?: ReactNode;
}) {
  const [indice, setIndice] = useState(0);
  const total = slides.length;
  const trocandoRef = useRef(false);

  useEffect(() => {
    if (total <= 1) return;

    const id = window.setInterval(() => {
      if (trocandoRef.current) return;
      trocandoRef.current = true;
      setIndice((atual) => (atual + 1) % total);
      window.setTimeout(() => {
        trocandoRef.current = false;
      }, TRANSICAO_MS);
    }, intervaloMs);

    return () => window.clearInterval(id);
  }, [intervaloMs, total]);

  if (total === 0) {
    return (
      <Empty className={cn('min-h-[100dvh] border border-dashed', className)}>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImagesIcon />
          </EmptyMedia>
          <EmptyTitle>Nenhuma imagem</EmptyTitle>
          <EmptyDescription>
            Adicione imagens em <code>public/carrossel</code> e liste-as em{' '}
            <code>src/data/carrossel.ts</code>.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const irPara = (proximoIndice: number) => {
    if (trocandoRef.current || proximoIndice === indice) return;
    trocandoRef.current = true;
    setIndice(proximoIndice);
    window.setTimeout(() => {
      trocandoRef.current = false;
    }, TRANSICAO_MS);
  };

  const anterior = () => irPara((indice - 1 + total) % total);
  const proximo = () => irPara((indice + 1) % total);

  return (
    <div
      className={cn('relative min-h-[100dvh] w-full overflow-hidden', className)}
      role="region"
      aria-roledescription="carrossel"
      aria-label="Galeria de imagens de fundo"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {slides.map((slide, i) => (
          <div
            key={slide.src}
            className={cn(
              'absolute inset-0 will-change-[opacity] transition-opacity ease-in-out',
              i === indice ? 'opacity-100' : 'opacity-0',
            )}
            style={{ transitionDuration: `${TRANSICAO_MS}ms` }}
          >
            <Image
              src={slide.src}
              alt=""
              fill
              sizes="100vw"
              quality={80}
              className="object-cover"
              priority={i <= 1}
              loading={i <= 1 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/70" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.35)_100%)]" />
      </div>

      <div className="relative z-10 flex min-h-[100dvh] w-full flex-col items-center justify-center px-5 pb-24 pt-24 sm:px-8 md:px-10 lg:px-16">
        {children}
      </div>

      {total > 1 ? (
        <>
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            className="absolute top-1/2 left-3 z-20 -translate-y-1/2 rounded-full border-0 bg-white/15 text-white hover:bg-white/25 sm:left-5"
            onClick={anterior}
            aria-label="Imagem anterior"
          >
            <ChevronLeft />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="icon-lg"
            className="absolute top-1/2 right-3 z-20 -translate-y-1/2 rounded-full border-0 bg-white/15 text-white hover:bg-white/25 sm:right-5"
            onClick={proximo}
            aria-label="Próxima imagem"
          >
            <ChevronRight />
          </Button>

          <div className="absolute inset-x-0 bottom-8 z-20 flex justify-center gap-2.5">
            {slides.map((slide, i) => (
              <button
                key={slide.src}
                type="button"
                aria-label={`Ir para imagem ${i + 1}`}
                aria-current={i === indice}
                className={cn(
                  'h-2 rounded-full transition-all duration-300',
                  i === indice
                    ? 'w-7 bg-white'
                    : 'w-2 bg-white/45 hover:bg-white/70',
                )}
                onClick={() => irPara(i)}
              />
            ))}
          </div>
        </>
      ) : null}

      <p className="sr-only" aria-live="polite">
        Imagem {indice + 1} de {total}: {slides[indice]?.alt}
      </p>
    </div>
  );
}
