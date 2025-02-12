import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { YahtzeeProvider } from './context/YahtzeeContext/YahtzeeContext';
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
    <YahtzeeProvider>
        <RouterProvider router={router} />
    </YahtzeeProvider>
  );
}

export default App;
