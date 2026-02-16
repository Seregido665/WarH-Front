import { useContext, useState } from "react";
import { loginUser, forgotPassword } from "../services/userService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/authContext";
import "../styles/login.css";

const Login = () => {
  const { login } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true)

    loginUser(userInfo)
      .then((response) => {
        console.log('Login exitoso')
        console.log('response', response)

        // Asumir que la respuesta del backend incluye { token, user } o solo { token }
        if (response?.token) {
          console.log('response tiene token', response)
          login(response) // handle storing token and fetching profile
        }
        setError(null)
        navigate("/profile")
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err.message || 'Login failed';
        setError(msg)
      })
      .finally(() => setLoading(false));
  }

  const handleForgotPassword = async () => {
    const email = window.prompt('Introduce tu email para recibir el enlace de recuperación:');
    if (!email) return;
    try {
      const res = await forgotPassword(email);
      const msg = res?.message || 'Si el email existe, se enviará un enlace de recuperación. Revisa tu bandeja.';
      alert(msg);
    } catch (err) {
      console.error('Forgot password error', err);
      const remoteMsg = err?.response?.data?.message || err?.message;
      alert(remoteMsg || 'Error al solicitar recuperación de contraseña');
    }
  };

  return (
    <div className="login-container pt-5 pb-5">
      <form onSubmit={handleLogin} className="login-form">
        <h2>LOGIN</h2>

        <div className="form-group">
          <label htmlFor="email">Correo</label>
          <input
            onChange={handleChange}
            type="email"
            id="email"
            name="email"
            placeholder="Introduce tu correo"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Cotraseña</label>
          <input
            onChange={handleChange}
            type="password"
            id="password"
            name="password"
            placeholder="Introduce tu contraseña"
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Iniciando...' : 'Iniciar Sesión'}
        </button>
        <button type="button" className="btn btn-link pt-4" onClick={handleForgotPassword}>Olvido su contraseña?</button>
        
          <p className="auth-link mb-0 pt-4">Don't have an account?</p>
          <a href="/register">REGISTRARSE</a>
          
      </form>
    </div>
  );
};

export default Login;
