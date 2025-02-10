import './App.css';
import { createBrowserRouter, RouterProvider, useLocation } from 'react-router-dom';
import { GameplayProvider } from './context/GameplayContext/GameplayContext';
import { Gameplay } from './page/Gameplay/Gameplay';
import { Login } from './page/Login/Login';
import { useEffect, useState } from 'react';

export function useStandaloneMode() {
  const [isStandalone, setIsStandalone] = useState(false);
  const location = useLocation(); // Récupère la route actuelle

  useEffect(() => {
    // Fonction pour vérifier si l'application tourne en mode standalone
    const checkStandalone = () => {
      setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
    };

    checkStandalone(); // Vérifie au premier chargement

    // Vérifie après chaque changement de route
    window.addEventListener("resize", checkStandalone);

    return () => {
      window.removeEventListener("resize", checkStandalone);
    };
  }, [location]); // Se déclenche à chaque changement d'URL

  return isStandalone;
}


function App() {
  const isStandalone = useStandaloneMode();
  const router = createBrowserRouter([
    {
      children: [
        {
          path: '/play',
          element: <Gameplay />,
        },
        {
          path: '/',
          element: <Login />,
        },
        {
          path: '/*',
          element: <Login />,
        }
      ],
    },
  ]);

  return (
    <GameplayProvider>
      <div className={isStandalone ? "fullscreen-ios" : ""}>
        <RouterProvider router={router} />
      </div>
    </GameplayProvider>
  );
}

export default App;
