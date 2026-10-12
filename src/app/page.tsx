import Link from "next/link";
import MenuMobile from "../components/menuMobile";
import CarrosselImagens from "../components/carrosselImagens";
import FormularioContato from "../components/formularioContato";
import { buttonVariants } from "@/components/ui/button";
import { sessaoAtual } from "@/src/lib/auth/sessao";
import { destinoDoPapel } from "@/src/lib/perfil";
import {
  Briefcase,
  Clock,
  GraduationCap,
  Handshake,
  Mail,
  MapPin,
  MonitorPlay,
  Phone,
  Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const servicos = [
  {
    icon: GraduationCap,
    titulo: "Cursos e palestras",
    texto: "Interpretação para cursos, palestras e workshops educacionais.",
  },
  {
    icon: Stethoscope,
    titulo: "Consultas médicas",
    texto:
      "Acompanhamento em consultas médicas, exames e procedimentos hospitalares.",
  },
  {
    icon: Briefcase,
    titulo: "Reuniões empresariais",
    texto: "Interpretação em reuniões, entrevistas e eventos corporativos.",
  },
  {
    icon: MonitorPlay,
    titulo: "Eventos ao vivo",
    texto: "Interpretação em conferências, seminários e transmissões ao vivo.",
  },
] as const;

export default async function Home() {
  const sessao = await sessaoAtual();
  const entrarHref = sessao ? destinoDoPapel(sessao.papel) : "/entrar";
  const entrarLabel = sessao
    ? sessao.papel === "interprete"
      ? "Painel"
      : "Minha conta"
    : "Entrar";

  const agendarHref =
    sessao?.papel === "interprete"
      ? "/painel"
      : sessao?.papel === "cliente"
        ? "/conta"
        : "/entrar";
  const agendarLabel =
    sessao?.papel === "interprete"
      ? "Abrir painel"
      : sessao?.papel === "cliente"
        ? "Agendar agora"
        : "Entrar para agendar";

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--header-bg)_92%,transparent)] shadow-[var(--header-shadow)] backdrop-blur-sm">
        <nav className="grid h-16 w-full grid-cols-[1fr_auto] items-center gap-4 px-5 sm:px-8 md:grid-cols-[1fr_auto_1fr] md:px-10 lg:px-16">
          <Link href="/" className="flex items-center gap-2.5 justify-self-start no-underline">
            <Handshake
              className="size-5 shrink-0 text-primary"
              aria-hidden="true"
              strokeWidth={2}
            />
            <span className="text-lg font-semibold tracking-tight text-primary">
              Libras Interprete
            </span>
          </Link>
          <MenuMobile entrarHref={entrarHref} entrarLabel={entrarLabel} />
        </nav>
      </header>

      <main>
        <section id="home" className="relative w-full">
          <CarrosselImagens>
            <div className="flex w-full max-w-3xl flex-col items-center text-center">
              <h1 className="max-w-[18ch] text-balance text-4xl font-semibold tracking-tight text-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl">
                Interpretação em Libras
              </h1>
              <p className="mt-4 text-lg text-white/90 sm:text-xl">
                Profissional qualificada para sua comunicação
              </p>
              <p className="mt-5 max-w-[42ch] text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
                Agende interpretação em Libras para eventos, consultas, reuniões
                ou cursos.
              </p>
              <Link
                href={agendarHref}
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "mt-10 px-6 shadow-lg shadow-black/20",
                )}
              >
                {agendarLabel}
              </Link>
            </div>
          </CarrosselImagens>
        </section>

        <section
          id="services"
          className="flex w-full justify-center border-y border-border bg-muted/60 px-5 py-24 sm:px-8 sm:py-28"
        >
          <div className="w-full max-w-5xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              Nossos serviços
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-center text-pretty leading-relaxed text-muted-foreground">
              Atendimento presencial ou remoto, conforme a necessidade do seu
              compromisso.
            </p>
            <ul className="mt-14 grid list-none grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
              {servicos.map(({ icon: Icon, titulo, texto }) => (
                <li
                  key={titulo}
                  className="rounded-xl border border-border bg-card px-8 py-10 text-center shadow-[var(--card-shadow)] transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <span className="mx-auto mb-5 grid size-12 place-items-center rounded-xl bg-accent text-primary">
                    <Icon className="size-6" aria-hidden="true" strokeWidth={1.8} />
                  </span>
                  <h3 className="text-xl font-semibold text-primary">{titulo}</h3>
                  <p className="mx-auto mt-3 max-w-[36ch] leading-relaxed text-muted-foreground">
                    {texto}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section
          id="schedule"
          className="flex w-full justify-center px-5 py-24 sm:px-8 sm:py-28"
        >
          <div className="w-full max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              Agendamento
            </h2>
            <p className="mt-6 text-pretty text-lg leading-relaxed text-muted-foreground">
              Pela área logada você escolhe o tipo de interpretação, a data e o
              horário disponíveis. O pedido fica registrado para acompanhamento e
              confirmação.
            </p>
            <p className="mx-auto mt-4 max-w-[48ch] text-pretty leading-relaxed text-muted-foreground">
              Clientes agendam e acompanham os horários na conta. Intérpretes
              gerenciam a agenda pelo painel.
            </p>
            <Link
              href={agendarHref}
              className={cn(buttonVariants({ size: "lg" }), "mt-10 px-6")}
            >
              {agendarLabel}
            </Link>
          </div>
        </section>

        <section
          id="contact"
          className="flex w-full justify-center border-t border-border bg-muted/60 px-5 py-24 sm:px-8 sm:py-28"
        >
          <div className="w-full max-w-5xl">
            <h2 className="text-center text-3xl font-semibold tracking-tight text-primary sm:text-4xl">
              Contato
            </h2>
            <p className="mx-auto mt-4 max-w-[48ch] text-center text-pretty leading-relaxed text-muted-foreground">
              Tire dúvidas ou peça um orçamento. Respondemos em horário comercial.
            </p>
            <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              <div className="rounded-xl border border-border bg-card px-8 py-10 shadow-[var(--card-shadow)]">
                <h3 className="mb-6 text-xl font-semibold text-primary">
                  Informações
                </h3>
                <ul className="space-y-4 text-muted-foreground">
                  <li className="flex items-start gap-3">
                    <Mail
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                    <span>contato@librasinterprete.com.br</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Phone
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                    <span>(11) 99999-9999</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                    <span>São Paulo - SP</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Clock
                      className="mt-0.5 size-4 shrink-0 text-primary"
                      aria-hidden="true"
                      strokeWidth={2}
                    />
                    <span>Segunda a sexta: 08:00 - 18:00</span>
                  </li>
                </ul>
              </div>
              <div className="rounded-xl border border-border bg-card px-8 py-10 shadow-[var(--card-shadow)]">
                <h3 className="mb-6 text-xl font-semibold text-primary">
                  Envie uma mensagem
                </h3>
                <FormularioContato />
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[var(--footer-bg)] px-5 py-10 text-center text-[var(--footer-text)] sm:px-8">
        <p>
          &copy; {new Date().getFullYear()} Libras Interprete - Todos os direitos
          reservados
        </p>
        <p className="mt-2 inline-flex items-center justify-center gap-2 text-sm opacity-90">
          <Handshake className="size-4" aria-hidden="true" strokeWidth={2} />
          Inclusão é o caminho
        </p>
      </footer>
    </div>
  );
}
