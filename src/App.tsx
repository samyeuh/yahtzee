import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { YahtzeeProvider } from './context/YahtzeeContext/YahtzeeContext';
import { Gameplay } from './page/Gameplay/Gameplay';
import { Login } from './page/Login/Login';
import { Scores } from './page/Scores/Scores';


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
          path: '/scores',
          element: <Scores />,
        },
        {
          path: '/*',
          element: <Login />,
        }
      ],
    },
  ]);

  return (
    <YahtzeeProvider>
        <RouterProvider router={router} />
    </YahtzeeProvider>
  );
}

export default App;
