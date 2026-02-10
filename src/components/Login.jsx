import { useContext, useState } from "react";
import { loginUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import AuthContext from "../contexts/authContext";

const Login = () => {
  const { handleSetUser } = useContext(AuthContext)
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState()
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

    loginUser(userInfo)
      .then((response) => {
        console.log('Login exitoso')
        console.log('response', response)

        // Asumir que la respuesta del backend incluye { token, user } o solo { token }
        if (response.token) {
          console.log('response tiene token', response)
          handleSetUser(response) // response debería tener { token, user }
        }
        setError({})
        navigate("/profile")
      })
      .catch((err) => {
        setError(err.response.data.message)
      });
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

        {error && <p class="text-danger">{error}</p>}

        <button
          type="submit"
          className="submit-button"
        >
          Login
        </button>

        <p className="auth-link">
          Don't have an account? <a href="/register">Sign up</a>
        </p>
      </form>
    </div>
  );
};

export default Login;
