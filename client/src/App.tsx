import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Homepage from './pages/HomePage'
import SignUp from './pages/SignUp'


function App() {
  return (
    <>
    <Routes>
     <Route path='/' element={<Homepage/>} />
     <Route path='/signUp' element={<SignUp/>} />
     <Route path='/login' element={<Login/>} />
    </Routes>
      
    </>
  )
}

export default App
