// pages/404.js
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Página no encontrada | Toysnow</title>
        <meta name="description" content="Lo sentimos, la página que buscas no existe en nuestra tienda erótica" />
      </Head>
      
      <div className="error-container">
        <div className="error-content">
          <div className="error-number">
            <span className="gold-text">4</span>
            <span className="gold-text">0</span>
            <span className="gold-text">4</span>
          </div>
          
          <h1 className="error-title">Página no encontrada</h1>
          
          <p className="error-message">
            Lo sentimos, la página que estás buscando no existe o ha sido movida.
          </p>
          
          <div className="error-actions">
            <button 
              onClick={() => router.back()} 
              className="back-button"
            >
              Volver atrás
            </button>
            
            <span className="divider">o</span>
            
            <Link href="/" className="home-link">
              Ir a la página principal
            </Link>
          </div>
        </div>
        
        <div className="error-decoration">
          <div className="decoration-item decoration-1"></div>
          <div className="decoration-item decoration-2"></div>
          <div className="decoration-item decoration-3"></div>
        </div>
      </div>

      <style jsx>{`
        .error-container {
          min-height: 100vh;
          background-color: #000;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 20px;
        }
        
        .error-content {
          text-align: center;
          z-index: 2;
          position: relative;
        }
        
        .error-number {
          font-size: 8rem;
          font-weight: bold;
          margin-bottom: 20px;
          letter-spacing: 10px;
        }
        
        .gold-text {
          color: #D4AF37;
          text-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }
        
        .error-title {
          font-size: 1.8rem;
          margin-bottom: 20px;
          color: #D4AF37;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
        
        .error-message {
          font-size: 1.1rem;
          margin-bottom: 30px;
          max-width: 500px;
          line-height: 1.6;
        }
        
        .error-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 15px;
        }
        
        .back-button {
          background: transparent;
          border: 1px solid #D4AF37;
          color: #D4AF37;
          padding: 12px 25px;
          cursor: pointer;
          font-size: 1rem;
          transition: all 0.3s ease;
          border-radius: 4px;
        }
        
        .back-button:hover {
          background: #D4AF37;
          color: #000;
        }
        
        .divider {
          color: #D4AF37;
        }
        
        .home-link {
          color: #D4AF37;
          text-decoration: none;
          border-bottom: 1px solid #D4AF37;
          padding-bottom: 2px;
          transition: all 0.3s ease;
        }
        
        .home-link:hover {
          color: #FFF;
          border-bottom-color: #FFF;
        }
        
        .error-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .decoration-item {
          position: absolute;
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
        }
        
        .decoration-1 {
          width: 150px;
          height: 150px;
          top: 10%;
          left: 10%;
          border-radius: 50%;
          animation: float 6s ease-in-out infinite;
        }
        
        .decoration-2 {
          width: 100px;
          height: 100px;
          bottom: 15%;
          right: 15%;
          transform: rotate(45deg);
          animation: pulse 4s ease-in-out infinite;
        }
        
        .decoration-3 {
          width: 80px;
          height: 80px;
          top: 50%;
          right: 20%;
          border-radius: 50%;
          animation: float 5s ease-in-out infinite reverse;
        }
        
        @keyframes float {
          0% {
            transform: translateY(0) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(10deg);
          }
          100% {
            transform: translateY(0) rotate(0deg);
          }
        }
        
        @keyframes pulse {
          0% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.7;
          }
          100% {
            opacity: 0.3;
          }
        }
        
        @media (max-width: 768px) {
          .error-number {
            font-size: 6rem;
          }
          
          .error-title {
            font-size: 1.5rem;
          }
          
          .error-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </>
  );
}