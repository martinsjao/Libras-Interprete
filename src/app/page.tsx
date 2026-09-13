import Script from "next/script";
import MenuMobile from "../components/menuMobile";
import FormularioAgendamento from "../components/formularioAgendamento";
import FormularioContato from "../components/formularioContato";

export default function Home() {
  return (
    <div>
      <Script src="https://vlibras.gov.br/app/vlibras-plugin.js" strategy="afterInteractive" />

      <header>
        <nav>
          <div className="logo">
            <h1>🤟 Libras Interprete</h1>
          </div>
          <MenuMobile />
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-content">
          <h2>Interpretação em Libras</h2>
          <h3>Profissional qualificada para sua comunicação</h3>
          <p>Agende agora mesmo uma interpretação em Libras para seu evento, consulta, reunião ou curso.</p>
          <a href="#schedule" className="btn-primary">Agendar Agora</a>
        </div>
        <div className="hero-image">
          <img src="https://via.placeholder.com/400x300/2196F3/FFFFFF?text=Libras+Interprete" alt="Intérprete de Libras" />
        </div>
      </section>

      <section id="services" className="services">
        <h2>Nossos Serviços</h2>
        <div className="services-grid">
          <div className="service-card">
            <h3>📚 Cursos e Palestras</h3>
            <p>Interpretação para cursos, palestras e workshops educacionais.</p>
          </div>
          <div className="service-card">
            <h3>🏥 Consultas Médicas</h3>
            <p>Acompanhamento em consultas médicas, exames e procedimentos hospitalares.</p>
          </div>
          <div className="service-card">
            <h3>💼 Reuniões Empresariais</h3>
            <p>Interpretação em reuniões, entrevistas e eventos corporativos.</p>
          </div>
          <div className="service-card">
            <h3>📺 Eventos ao Vivo</h3>
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
            <h3>Informações de Contato</h3>
            <p>📧 contato@librasinterprete.com.br</p>
            <p>📱 (11) 99999-9999</p>
            <p>📍 São Paulo - SP</p>
            <p>🕐 Segunda a Sexta: 08:00 - 18:00</p>
          </div>
          <div className="contact-form">
            <h3>Envie uma Mensagem</h3>
            <FormularioContato />
          </div>
        </div>
      </section>

      <footer>
        <p>&copy; 2024 Libras Interprete - Todos os direitos reservados</p>
        <p>🤟 Inclusão é o caminho!</p>
      </footer>
    </div>
  );
}