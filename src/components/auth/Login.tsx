import { useState } from 'react';
import loginImg from './../../assets/imgs/login.png'
import axios from 'axios';
import useAuthStore from '../../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

interface DecodedToken {
    user_id: number;
}


const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setTokens, setUserId, clearTokens} = useAuthStore()
    const navigate = useNavigate()

    const URL = import.meta.env.VITE_BASE_URL

    const handleLogin = () => {
        console.log('loging');
        console.log('URL', URL)
        axios.post(`${URL}/login`, {
            usuario: username,
            clave: password
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })
        .then(response => {
            console.log('Response',response)
            console.log('Response Data', response.data);
            const decoded = jwtDecode<DecodedToken>(response.data.access_token)
            clearTokens()
            setTokens(response.data.access_token, response.data.refresh_token)
            setUserId(decoded.user_id)
            navigate('/')
        })
        .catch(error => {
            console.error('Error', error);
        });
    }

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/imagenes/fndinicio.jpg')" }}
    >
        
      <div
        className="relative w-[519px] h-[272px] flex items-center justify-center bg-cover bg-center p-6"
        // style={{ backgroundImage: {loginImg} }}
      >
        <img className='absolute top-0 left-0'  src={loginImg} alt="" />
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleLogin();
            }}
          className="relative z-50 w-full max-w-md p-6 flex flex-col items-end justify-end pt-24"
        >
          <div className="mb-4 w-[65%] grid grid-cols-3 justify-items-center place-content-start gap-4">
            <label htmlFor="usuario" className="mt-1 font-semibold block text-gray-700 italic font-calibri">
              Usuario
            </label>
            <input
                type="text"
                id="usuario"
                name="usuario"
                className="pl-1 w-full border rounded mt-1 uppercase col-span-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="mb-4 w-[65%] grid grid-cols-3 gap-4">
            <label htmlFor="clave" className="mt-1 font-semibold block text-gray-700 italic font-calibri">
              Contraseña
            </label>
            <input
                type="password"
                id="clave"
                name="clave"
                className="pl-1 w-full border rounded mt-1 col-span-2"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="relative z-50 flex justify-center gap-6">
            <button
              type="submit"
              className="w-24 h-8 bg-gray-100 rounded-2xl shadow-md hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
            >
              Ingresar
            </button>
            <button
              type="reset"
              className="w-24 h-8 bg-gray-100 rounded-2xl shadow-md hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
