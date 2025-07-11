import { useState } from 'react';
import useAuthStore from '../../store/useAuthStore';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Input from '../ui/Input';
import useLogin from '../../hooks/auth/useLogin';

interface DecodedToken {
    user_id: number;
}

const Login = () => {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const {setTokens, setUserId, clearTokens} = useAuthStore()
    const navigate = useNavigate()

    const login = useLogin()
    const [loading, setLoading] = useState(false);

    const [usernameError, setUsernameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [messageError, setMessageError] = useState('');

    const handleLogin = (e: React.FormEvent ) => {

      e.preventDefault()
      setMessageError('')

      if (!username) {
        setUsernameError('El nombre de usuario es requerido');
        return;
      } 

      if (!password) {
        setPasswordError('La contraseña es requerida');
        return;
      }

      setLoading(true);

      login.mutate({
            credentials: {
                username: username,
                password: password
            }
        }, {
            onSuccess: (jwtData) => {
                const decoded = jwtDecode<DecodedToken>(jwtData.access)
                clearTokens()
                setTokens(jwtData.access, jwtData.refresh)
                setUserId(decoded.user_id)
                navigate('/app')
            },
            onError: (err) => {
                console.error('Login error:', err);
                setMessageError('Usuario o contraseña incorrectos');
            },
            onSettled: () => {
              setLoading(false);
            }
      })
    }

  return (
    <div className="w-full min-h-screen flex justify-center items-center gap-6 relative  overflow-hidden mx-auto">
    <motion.div 
    className="relative w-[90%] sm:w-[60%] md:w-[40%] lg:w-[25%] bg-white/5 backdrop-blur-lg p-8 rounded-lg shadow-2xl shadow-blue-900 "
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5 }}
>
    {/* Title */}
    <motion.h2 
        className="text-4xl font-bold text-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
    >
        Accede
    </motion.h2>
    <p className='text-center text-sm text-red-600 my-4'>{messageError}</p>
    {/* Form */}
    <motion.form 
        onSubmit={handleLogin} 
        className="w-full flex flex-col gap-10 items-center justify-center mx-auto"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
    >
        <Input 
          // label='Usuario'
          value={username}
          setValue={setUsername}
          placeholder='Usuario'
          error={usernameError}
          setError={setUsernameError}
      />
      <Input 
            // label='Contraseña'
            value={password}
            setValue={setPassword}
            type='password'
            placeholder='Contraseña'
            error={passwordError}
            setError={setPasswordError}
        />


        <div className="flex justify-center">
          
            <button
              className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm cursor-pointer"
            >
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
        </div>
        {/* <Link 
            to={'/forgot-password'}
            className="text-xs text-center hover:text-blue-500 cursor-pointer">Olvidaste tu Contraseña?</Link> */}
    </motion.form>
</motion.div>
</div>
    // <div
    //   className="flex items-center justify-center min-h-screen bg-cover bg-center"
    //   style={{ backgroundImage: "url('/imagenes/fndinicio.jpg')" }}
    // >
        
    //   <div
    //     className="relative w-[519px] h-[272px] flex items-center justify-center bg-cover bg-center p-6"
    //     // style={{ backgroundImage: {loginImg} }}
    //   >
    //     <img className='absolute top-0 left-0'  src={loginImg} alt="" />
    //     <form
    //         onSubmit={(e) => {
    //             e.preventDefault();
    //             handleLogin();
    //         }}
    //       className="relative z-50 w-full max-w-md p-6 flex flex-col items-end justify-end pt-24"
    //     >
    //       <div className="mb-4 w-[65%] grid grid-cols-3 justify-items-center place-content-start gap-4">
    //         <label htmlFor="usuario" className="mt-1 font-semibold block text-gray-700 italic font-calibri">
    //           Usuario
    //         </label>
    //         <input
    //             type="text"
    //             id="usuario"
    //             name="usuario"
    //             className="pl-1 w-full border rounded mt-1 uppercase col-span-2"
    //             value={username}
    //             onChange={(e) => setUsername(e.target.value)}
    //         />
    //       </div>

    //       <div className="mb-4 w-[65%] grid grid-cols-3 gap-4">
    //         <label htmlFor="clave" className="mt-1 font-semibold block text-gray-700 italic font-calibri">
    //           Contraseña
    //         </label>
    //         <input
    //             type="password"
    //             id="clave"
    //             name="clave"
    //             className="pl-1 w-full border rounded mt-1 col-span-2"
    //             value={password}
    //             onChange={(e) => setPassword(e.target.value)}
    //         />
    //       </div>

    //       <div className="relative z-50 flex justify-center gap-6">
    //         <button
    //           type="submit"
    //           className="w-24 h-8 bg-gray-100 rounded-2xl shadow-md hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
    //         >
    //           Ingresar
    //         </button>
    //         <button
    //           type="reset"
    //           className="w-24 h-8 bg-gray-100 rounded-2xl shadow-md hover:bg-gray-200 transition duration-300 ease-in-out cursor-pointer"
    //         >
    //           Cancelar
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>
  );
};

export default Login;
