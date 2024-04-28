import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { GameplayProvider } from './context/GameplayContext/GameplayContext'
import { Gameplay } from './page/Gameplay/Gameplay'
import { Login } from './page/Login/Login'
import { Endpage } from './page/Endpage/Endpage'

function App() {
  return (
    <>
    <GameplayProvider>
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>}/>
            <Route path="/play" element={<Gameplay/>}/>
            <Route path="/end" element={<Endpage/>}/>
          </Routes>
      </BrowserRouter>
    </GameplayProvider>
    </>
  )
}

export default App
