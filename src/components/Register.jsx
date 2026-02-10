import { use, useState } from "react";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [userInfo, setUserInfo] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const updateField = (event) => {
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
      .catch(errorResponse => {
        if (errorResponse.status == 422) {
          setErrors({ email: { message: 'Email already in use' } });
        } else {
          setErrors(errorResponse.response.data.errors);
        }
      });
  };

  return (
    <div className="container-fluid py-5">
      <div className="row d-flex justify-content-center">
        <div className="col-lg-5 col-md-7">
          <div className="card shadow-sm border-0">
            <h4 className="mb-0">Create Account</h4>
            <div className="card-body p-4">
              <form onSubmit={processRegistration}>
                <div className="form-group mb-4">
                  <label className="form-label fw-bold">Email Address</label>
                  <input
                    name="email"
                    className="form-control form-control-lg"
                    value={userInfo.email}
                    onChange={updateField}
                    placeholder="Enter your email"
                  />
                  {errors.email && (<div className="text-danger mt-2">{errors.email.message}</div>)}
                </div>
                <div className="form-group mb-4">
                  <label className="form-label fw-bold">Password</label>
                  <input
                    type="password"
                    name="password"
                    className="form-control form-control-lg"
                    value={userInfo.password}
                    onChange={updateField}
                    placeholder="Create password"
                  />
                  {errors.password && (<div className="text-danger mt-2">{errors.password.message}</div>)}
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100 mt-3"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
