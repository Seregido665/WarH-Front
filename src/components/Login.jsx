import { useContext, useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/authContext";

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

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            onChange={handleChange}
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            onChange={handleChange}
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
          />
        </div>

        {error && <p className="text-danger">{error}</p>}

        <button
          type="submit"
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p className="auth-link">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
