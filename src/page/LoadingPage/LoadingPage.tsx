import { useEffect, useState } from 'react';
import './LoadingPage.css'

interface LoadingPageProps {
  onFadeComplete: () => void;
}

export function LoadingPage({ onFadeComplete }: LoadingPageProps) {
  const gif = "/yahtzee.gif";
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Simuler un délai pendant lequel le chargement s'effectue
    setTimeout(() => {
      setFadeOut(true);  // Activer le fade-out après un certain temps
    }, 1000);  // 2 secondes d'affichage du chargement par exemple

    // Après que l'animation de fondu soit terminée, on peut signaler que le chargement est terminé
    setTimeout(() => {
      onFadeComplete();  // Appeler la fonction pour indiquer que le fade est terminé
    }, 2000);  // 3 secondes pour inclure la durée du fade-out
  }, [onFadeComplete]);

  return (
    <div className={`loading-page ${fadeOut ? 'fade-out' : ''}`}>
      <img src={gif} alt="Loading..." />
    </div>
  );
}