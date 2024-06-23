import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Login from './Pages/Login';
import Home from './Pages/Home';
import Register from './Pages/Register';
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './Pages/ForgotPassword';
import ResetPassword from './Pages/ResetPassword';
import Action from './Components/Action';
import Pdf from './Components/Pdf';
import Image from './Components/Image';
import Navbar from './Components/Navbar';

function App() {
  return (
    <div className="App">
       <BrowserRouter>
        <Routes>

          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/register' element={<Register />}/>
          <Route path='/forgotPassword' element={<ForgotPassword />}/>
          <Route path='/resetPassword/:token' element={<ResetPassword />}/>
          <Route path='/action' element={<Action />}/>
          <Route path='/image' element={<Image />}/>
          <Route path='/pdf' element={<Pdf />}/>

        </Routes>
       </BrowserRouter>
       <ToastContainer />
    </div>
  );
}

export default App;
