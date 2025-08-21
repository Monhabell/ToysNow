'use client';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Custom404() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Página no encontrada | ToysNow</title>
        <meta name="description" content="Lo sentimos, la página que buscas no existe en nuestra tienda erótica" />
      </Head>
      
      <div className="sensual-container">
        <div className="sensual-content">
          <div className="sensual-number">
            <span className="sensual-digit">4</span>
            <div className="sensual-orb"></div>
            <span className="sensual-digit">4</span>
          </div>
          
          <h1 className="sensual-title">Algo excitante falta aquí...</h1>
          
          <p className="sensual-message">
            La página que buscas se ha esfumado en la intimidad de la noche.
            Pero no te preocupes, tenemos muchas otras cosas interesantes que explorar.
          </p>
          
          <div className="sensual-actions">
            <button 
              onClick={() => router.back()} 
              className="sensual-button back"
            >
              ↶ Volver atrás
            </button>
            
            <Link href="/productos" className="sensual-button primary">
              Descubrir placeres
            </Link>
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
          min-height: 100vh;
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
        
        .sensual-content {
          text-align: center;
          z-index: 10;
          position: relative;
          max-width: 600px;
          padding: 40px;
          background: rgba(0, 0, 0, 0.4);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          border: 1px solid rgba(255, 105, 180, 0.2);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }
        
        .sensual-number {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 30px;
          position: relative;
        }
        
        .sensual-digit {
          font-size: 8rem;
          font-weight: 800;
          color: #ff69b4;
          text-shadow: 0 0 20px rgba(255, 105, 180, 0.7);
          position: relative;
          z-index: 2;
        }
        
        .sensual-orb {
          width: 80px;
          height: 80px;
          background: linear-gradient(145deg, #ff69b4, #ff1493);
          border-radius: 50%;
          margin: 0 10px;
          box-shadow: 0 0 30px rgba(255, 105, 180, 0.8);
          animation: pulse 3s infinite ease-in-out;
          position: relative;
          z-index: 1;
        }
        
        .sensual-title {
          font-size: 2.2rem;
          margin-bottom: 20px;
          color: #ff69b4;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-weight: 600;
        }
        
        .sensual-message {
          font-size: 1.2rem;
          margin-bottom: 40px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.8);
          font-style: italic;
        }
        
        .sensual-actions {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .sensual-button {
          padding: 15px 30px;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
        }
        
        .sensual-button.back {
          background: transparent;
          border: 2px solid #9370db;
          color: #9370db;
        }
        
        .sensual-button.back:hover {
          background: rgba(147, 112, 219, 0.2);
          transform: translateY(-3px);
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
          .sensual-digit {
            font-size: 5rem;
          }
          
          .sensual-orb {
            width: 50px;
            height: 50px;
            margin: 0 5px;
          }
          
          .sensual-title {
            font-size: 1.5rem;
          }
          
          .sensual-message {
            font-size: 1rem;
          }
          
          .sensual-actions {
            flex-direction: column;
            align-items: center;
          }
          
          .sensual-button {
            width: 100%;
            max-width: 250px;
          }
        }
      `}</style>
    </>
  );
}