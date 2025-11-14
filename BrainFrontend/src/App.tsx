// import { RecoilRoot } from 'recoil';
// import { BrowserRouter, data, Route, Routes } from 'react-router-dom';
import './App.css';
import { Home } from './pages/home';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { SignIn } from './pages/login';
import { Signup } from './pages/Signup';


function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<SignIn />} />
          <Route path='/signup' element={<Signup />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;