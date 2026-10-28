import Link from 'next/link';
import { Handshake } from 'lucide-react';
import ThemeToggle from '@/src/components/themeToggle';
import { sair } from '@/src/app/sair/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export default function AreaLogada({
  titulo,
  descricao,
  papel,
  children,
}: {
  titulo: string;
  descricao: string;
  papel: 'cliente' | 'interprete';
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-(--header-bg)/92 shadow-(--header-shadow) backdrop-blur-sm">
        <nav className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 md:px-10 lg:px-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-primary no-underline"
          >
            <Handshake className="size-5" aria-hidden="true" />
            <span>Libras Interprete</span>
          </Link>
          <div className="flex items-center gap-3">
            <Badge variant="secondary" className="hidden sm:inline-flex">
              {papel === 'interprete' ? 'Admin' : 'Cliente'}
            </Badge>
            <ThemeToggle />
            <form action={sair}>
              <Button type="submit" variant="outline" size="sm">
                Sair
              </Button>
            </form>
          </div>
        </nav>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 sm:px-8 md:px-10 pt-28 pb-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-primary text-3xl font-semibold tracking-tight">
            {titulo}
          </h1>
          <p className="text-muted-foreground max-w-2xl text-base">{descricao}</p>
        </div>
        <Separator />
        {children}
      </main>
    </div>
  );
}
