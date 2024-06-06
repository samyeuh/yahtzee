import './App.css'
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom'
import { GameplayProvider } from './context/GameplayContext/GameplayContext'
import { Gameplay } from './page/Gameplay/Gameplay'
import { Login } from './page/Login/Login'
import { Endpage } from './page/Endpage/Endpage'
import Navbar from './components/Navbar/Navbar'

function App() {
  const Layout = () => {
    return (
      <div>
        <Navbar />
        <div>
          <Outlet />
        </div>
    </div>
    )
  }

  const routerWithNav = [
    {
      element: <Layout />,
      children: [
        {
          path: '/play',
          element: <Gameplay/>,
        },
        {
          path: '/end',
          element: <Endpage />
        }
      ]
    }
  ]

  const routerWithoutNav = [
    {
      children: [
        {
          path: '/',
          element: <Login />
        }
      ]
    }
  ]

  const router = createBrowserRouter([...routerWithNav, ...routerWithoutNav]);

  return (
    <>
    <GameplayProvider>
      <RouterProvider router={router} />
    </GameplayProvider>
    </>
  )
}

export default App
