
import { Route, Routes } from 'react-router-dom'
import './App.css'
import Homepage from './pages/Homepage'
import SignUp from './pages/Signup'
import Login from './pages/Login'


function App() {
  return (
    <>
    <Routes>
     <Route path='/' element={<Homepage/>} />
     <Route path='/signup' element={<SignUp/>} />
     <Route path='/login' element={<Login/>} />
    </Routes>
      
    </>
  )
}

export default App
