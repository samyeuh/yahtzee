import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { GameplayProvider } from './context/GameplayContext/GameplayContext';
import { Gameplay } from './page/Gameplay/Gameplay';
import { Login } from './page/Login/Login';


function App() {
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
        <RouterProvider router={router} />
    </GameplayProvider>
  );
}

export default App;
