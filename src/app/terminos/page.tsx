'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';



export default function TermsAndConditions() {
  const [activeSection, setActiveSection] = useState<string>('general');
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const scrollToSection = (sectionId: string): void => {
    if (!isClient) return;
    
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Evitar que se ejecute código del servidor que pueda causar el error 405
  if (!isClient) {
    return (
      <div className="sensual-container">
        <div className="sensual-content terms-content">
          <h1 className="sensual-title main-title">Términos y Condiciones</h1>
          <p className="update-date">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Términos y Condiciones | ToysNow</title>
        <meta name="description" content="Conoce nuestros términos y condiciones para una experiencia segura y placentera" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      </Head>
      
      
      <div className="sensual-container ">
        <div className="sensual-content terms-content">
          <h1 className="sensual-title main-title">Términos y Condiciones</h1>
          <p className="update-date">Última actualización: 17 de junio de 2025</p>
          
          <div className="terms-nav">
            <button 
              className={activeSection === 'general' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('general')}
            >
              Información General
            </button>
            <button 
              className={activeSection === 'age' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('age')}
            >
              Edad Mínima
            </button>
            <button 
              className={activeSection === 'privacy' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('privacy')}
            >
              Privacidad
            </button>
            <button 
              className={activeSection === 'shipping' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('shipping')}
            >
              Envíos
            </button>
            <button 
              className={activeSection === 'returns' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('returns')}
            >
              Devoluciones
            </button>
            <button 
              className={activeSection === 'payment' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('payment')}
            >
              Pagos
            </button>
            <button 
              className={activeSection === 'responsibility' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('responsibility')}
            >
              Responsabilidad
            </button>
            <button 
              className={activeSection === 'property' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('property')}
            >
              Propiedad
            </button>
            <button 
              className={activeSection === 'changes' ? 'nav-button active' : 'nav-button'} 
              onClick={() => scrollToSection('changes')}
            >
              Cambios
            </button>
          </div>
          
          <div className="terms-sections">
            <section id="general" className="term-section">
              <h2 className="section-title">1. Información general</h2>
              <p>ToysNow es una tienda virtual que ofrece productos para adultos con fines de bienestar y placer sexual. Operamos desde Colombia, con atención personalizada a través de nuestras plataformas digitales:</p>
              <ul className="terms-list">
                <li><strong>Nombre comercial:</strong> ToysNow</li>
                <li><strong>Correo de contacto:</strong> toysnowco@gmail.com</li>
                <li><strong>WhatsApp pedidos y atención al cliente:</strong> +57 316 684 6893</li>
                <li><strong>Instagram:</strong> @toysnow.co</li>
                <li><strong>Facebook:</strong> facebook.com/toysnow.co</li>
              </ul>
            </section>
            
            <section id="age" className="term-section">
              <h2 className="section-title">2. Edad mínima</h2>
              <p>Al utilizar esta página, confirmas que tienes al menos 18 años de edad. No vendemos productos ni proporcionamos información a menores de edad.</p>
            </section>
            
            <section id="privacy" className="term-section">
              <h2 className="section-title">3. Privacidad y confidencialidad</h2>
              <ul className="terms-list">
                <li>Todos tus datos personales serán tratados con total confidencialidad y seguridad.</li>
                <li>Los envíos se realizan en empaques discretos, sin logos ni descripciones explícitas.</li>
                <li>No compartiremos tu información con terceros, excepto para cumplir con obligaciones legales o servicios logísticos.</li>
              </ul>
            </section>
            
            <section id="shipping" className="term-section">
              <h2 className="section-title">4. Envíos y entregas</h2>
              <ul className="terms-list">
                <li>Enviamos a todo Colombia con cobertura nacional mediante transportadoras confiables o servicio de mensajería directa en Bogotá.</li>
                <li>Los tiempos de entrega varían entre 1 a 4 días hábiles según la ciudad de destino.</li>
                <li>Para Bogotá, ofrecemos entregas el mismo día según disponibilidad.</li>
                <li>Costos de envío pueden variar y se informan antes de finalizar la compra.</li>
              </ul>
            </section>
            
            <section id="returns" className="term-section">
              <h2 className="section-title">5. Cambios y devoluciones</h2>
              <ul className="terms-list">
                <li>Por tratarse de productos íntimos, no aceptamos devoluciones por cambio de opinión.</li>
                <li>Solo se aceptarán cambios en caso de fallas de fábrica o daño en el producto, y debe notificarse dentro de las 48 horas posteriores a la entrega.</li>
                <li>Para iniciar un reclamo, deberás presentar fotos del empaque y del producto sin usar.</li>
              </ul>
            </section>
            
            <section id="payment" className="term-section">
              <h2 className="section-title">6. Métodos de pago</h2>
              <p>Aceptamos pagos mediante:</p>
              <ul className="terms-list">
                <li>Transferencia bancaria</li>
                <li>Nequi y Daviplata</li>
                <li>PSE y tarjetas (en desarrollo)</li>
                <li>Pago contra entrega (aplica solo en zonas seleccionadas y debe confirmarse con el asesor)</li>
              </ul>
              <p>Todos los pagos deben realizarse antes del despacho del producto, salvo los pedidos con modalidad contra entrega.</p>
            </section>
            
            <section id="responsibility" className="term-section">
              <h2 className="section-title">7. Responsabilidad de uso</h2>
              <ul className="terms-list">
                <li>Los productos deben usarse siguiendo las recomendaciones del fabricante.</li>
                <li>ToysNow no se hace responsable por un mal uso, manipulación indebida o reacciones adversas a los materiales.</li>
              </ul>
            </section>
            
            <section id="property" className="term-section">
              <h2 className="section-title">8. Propiedad intelectual</h2>
              <p>Todo el contenido del sitio web, redes sociales, imágenes, textos y diseños son propiedad de ToysNow y no pueden ser utilizados sin autorización previa.</p>
            </section>
            
            <section id="changes" className="term-section">
              <h2 className="section-title">9. Cambios en los términos</h2>
              <p>ToysNow se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Las actualizaciones serán publicadas en esta página con la fecha correspondiente.</p>
            </section>
            
            <div className="closing-message">
              <p>Gracias por elegirnos y por ser parte de una comunidad que promueve el placer con responsabilidad, respeto y libertad.</p>
              <Link href="/" className="sensual-button primary">
                Volver al Inicio
              </Link>
            </div>
          </div>
        </div>
        
        <div className="sensual-background">
          <div className="sensual-shape shape-1"></div>
          <div className="sensual-shape shape-2"></div>
          <div className="sensual-shape shape-3"></div>
          <div className="sensual-shape shape-4"></div>
          <div className="sensual-shape shape-5"></div>
        </div>
      </div>

      <style jsx>{`
        .sensual-container {
          min-height: 70vh;
          max-height: 100vh;
          background: linear-gradient(135deg, #1a001a 0%, #330033 50%, #4d004d 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
          font-family: 'Arial', sans-serif;

        }
        
        .sensual-content.terms-content {
          text-align: left;
          z-index: 10;
          position: relative;
          max-width: 900px;
          padding: 40px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 105, 180, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
          max-height: 90vh;
          overflow-y: auto;
        }
        
        .main-title {
          font-size: 2.5rem;
          margin-bottom: 10px;
          color: #ff69b4;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
          text-align: center;
        }
        
        .update-date {
          text-align: center;
          margin-bottom: 30px;
          color: rgba(255, 255, 255, 0.7);
          font-style: italic;
        }
        
        .terms-nav {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 105, 180, 0.3);
        }
        
        .nav-button {
          padding: 10px 15px;
          background: transparent;
          border: 1px solid #9370db;
          color: #9370db;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.8rem;
        }
        
        .nav-button:hover, .nav-button.active {
          background: rgba(147, 112, 219, 0.2);
          transform: translateY(-2px);
        }
        
        .nav-button.active {
          background: rgba(147, 112, 219, 0.3);
          border-color: #ff69b4;
          color: #ff69b4;
        }
        
        .terms-sections {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        
        .term-section {
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(255, 105, 180, 0.1);
        }
        
        .section-title {
          font-size: 1.5rem;
          margin-bottom: 15px;
          color: #ff69b4;
          font-weight: 600;
        }
        
        .terms-list {
          padding-left: 20px;
          margin: 15px 0;
        }
        
        .terms-list li {
          margin-bottom: 10px;
          line-height: 1.5;
        }
        
        .closing-message {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid rgba(255, 105, 180, 0.3);
        }
        
        .sensual-button {
          padding: 15px 30px;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-block;
          margin-top: 50px;
        }
        
        .sensual-button.primary {
          background: linear-gradient(to right, #ff69b4, #ff1493);
          color: white;
          box-shadow: 0 5px 15px rgba(255, 105, 180, 0.4);
        }
        
        .sensual-button.primary:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 20px rgba(255, 105, 180, 0.6);
        }
        
        .sensual-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          overflow: hidden;
        }
        
        .sensual-shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.3;
          filter: blur(15px);
        }
        
        .shape-1 {
          width: 300px;
          height: 300px;
          background: linear-gradient(45deg, #ff69b4, #ff1493);
          top: 10%;
          left: 5%;
          animation: float 15s infinite ease-in-out;
        }
        
        .shape-2 {
          width: 200px;
          height: 200px;
          background: linear-gradient(45deg, #9370db, #8a2be2);
          bottom: 15%;
          right: 10%;
          animation: float 12s infinite ease-in-out reverse;
        }
        
        .shape-3 {
          width: 150px;
          height: 150px;
          background: linear-gradient(45deg, #ff69b4, #ff1493);
          top: 40%;
          right: 20%;
          animation: pulse 8s infinite ease-in-out;
        }
        
        .shape-4 {
          width: 100px;
          height: 100px;
          background: linear-gradient(45deg, #9370db, #8a2be2);
          bottom: 30%;
          left: 15%;
          animation: pulse 10s infinite ease-in-out;
        }
        
        .shape-5 {
          width: 250px;
          height: 250px;
          background: linear-gradient(45deg, #ff69b4, #ff1493);
          top: 60%;
          left: 25%;
          animation: float 18s infinite ease-in-out;
        }
        
        @keyframes float {
          0% {
            transform: translate(0, 0) rotate(0deg);
          }
          33% {
            transform: translate(30px, -30px) rotate(60deg);
          }
          66% {
            transform: translate(-20px, 20px) rotate(120deg);
          }
          100% {
            transform: translate(0, 0) rotate(180deg);
          }
        }
        
        @keyframes pulse {
          0% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.5;
          }
          100% {
            transform: scale(1);
            opacity: 0.3;
          }
        }
        
        @media (max-width: 768px) {
          .sensual-content.terms-content {
            padding: 20px;
          }
          
          .main-title {
            font-size: 1.8rem;
          }
          
          .terms-nav {
            flex-direction: column;
            align-items: center;
          }
          
          .nav-button {
            width: 100%;
            text-align: center;
          }
          
          .section-title {
            font-size: 1.3rem;
          }
        }
      `}</style>
    </>
  );
}