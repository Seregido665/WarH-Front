import { useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";
import "../styles/register.css";

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const processRegistration = (event) => {
    event.preventDefault();
    registerUser(userInfo)
      .then(() => {
        setErrors({});
        navigate('/login')
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || err.message || 'Registration failed';
        setErrors({ general: { message: msg } });
      });
  };

  return (
      <div className="row d-flex justify-content-center register-container">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-sm border-0 mt-5 mb-5">
            <h4 className="mb-0">REGISTER</h4>
            <div className="card-body p-4">
              <form onSubmit={processRegistration}>
                <div className="form-group mb-4">
                  <label className="form-label fw-bold">Correo</label>
                  <input
                    name="email"
                    className="form-control form-control-lg"
                    value={userInfo.email}
                    onChange={handleChange}
                    placeholder="Introduce tu correo"
                  />
                </div>
                <div className="form-group mb-4">
                  <label className="form-label fw-bold">Contraseña</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    value={userInfo.password}
                    onChange={handleChange}
                    placeholder="Crea una contraseña"
                  />
                 </div>
                {errors.general && (<div className="text-danger mb-2">{errors.general.message}</div>)}
                <button
                  type="submit"
                  className="submit-button"
                >
                  Crear Cuenta
                </button>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
