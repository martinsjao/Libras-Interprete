import MenuMobile from "../components/menuMobile";
import FormularioAgendamento from "../components/formularioAgendamento";
import FormularioContato from "../components/formularioContato";
import ThemeToggle from "../components/themeToggle";
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

export default function Home() {
  return (
    <div className="page">
      <header>
        <nav>
          <div className="logo">
            <h1>
              <Handshake className="logo-icon" aria-hidden="true" />
              Libras Interprete
            </h1>
          </div>
          <div className="nav-actions">
            <ThemeToggle />
            <MenuMobile />
          </div>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-content">
          <h2>Interpretação em Libras</h2>
          <h3>Profissional qualificada para sua comunicação</h3>
          <p>
            Agende agora mesmo uma interpretação em Libras para seu evento,
            consulta, reunião ou curso.
          </p>
          <a href="#schedule" className="btn-primary">
            Agendar agora
          </a>
        </div>
        <div className="hero-image" aria-hidden="true">
          <div className="hero-illustration">
            <span className="hero-mark">
              <Handshake />
            </span>
            <p>Comunicação acessível</p>
          </div>
        </div>
      </section>

      <section id="services" className="services">
        <h2>Nossos Serviços</h2>
        <div className="services-grid">
          <div className="service-card">
            <span className="service-icon">
              <GraduationCap aria-hidden="true" />
            </span>
            <h3>Cursos e palestras</h3>
            <p>Interpretação para cursos, palestras e workshops educacionais.</p>
          </div>
          <div className="service-card">
            <span className="service-icon">
              <Stethoscope aria-hidden="true" />
            </span>
            <h3>Consultas médicas</h3>
            <p>
              Acompanhamento em consultas médicas, exames e procedimentos
              hospitalares.
            </p>
          </div>
          <div className="service-card">
            <span className="service-icon">
              <Briefcase aria-hidden="true" />
            </span>
            <h3>Reuniões empresariais</h3>
            <p>Interpretação em reuniões, entrevistas e eventos corporativos.</p>
          </div>
          <div className="service-card">
            <span className="service-icon">
              <MonitorPlay aria-hidden="true" />
            </span>
            <h3>Eventos ao vivo</h3>
            <p>Interpretação em conferências, seminários e transmissões ao vivo.</p>
          </div>
        </div>
      </section>

      <section id="schedule" className="schedule">
        <h2>Agendamento</h2>
        <div className="schedule-container">
          <FormularioAgendamento />
        </div>
      </section>

      <section id="contact" className="contact">
        <h2>Contato</h2>
        <div className="contact-container">
          <div className="contact-info">
            <h3>Informações de contato</h3>
            <p>
              <Mail className="contact-icon" aria-hidden="true" />
              contato@librasinterprete.com.br
            </p>
            <p>
              <Phone className="contact-icon" aria-hidden="true" />
              (11) 99999-9999
            </p>
            <p>
              <MapPin className="contact-icon" aria-hidden="true" />
              São Paulo - SP
            </p>
            <p>
              <Clock className="contact-icon" aria-hidden="true" />
              Segunda a sexta: 08:00 - 18:00
            </p>
          </div>
          <div className="contact-form">
            <h3>Envie uma mensagem</h3>
            <FormularioContato />
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; {new Date().getFullYear()} Libras Interprete — Todos os direitos reservados</p>
        <p className="footer-tagline">
          <Handshake className="footer-icon" aria-hidden="true" />
          Inclusão é o caminho
        </p>
      </footer>
    </div>
  );
}
