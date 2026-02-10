import { useContext, useEffect } from "react";
import AuthContext from "../contexts/authContext";

const Profile = () => {
  const { user, fetchUser } = useContext(AuthContext);

  useEffect(() => {
    const myInterval = setInterval(() => {
      console.log('pido usuario otra vez')
      fetchUser();
    }, 5000);

    return () => clearInterval(myInterval);

  }, [user, fetchUser]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Profile</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center">
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="img-fluid rounded-circle mb-3"
                    style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                  />
                  <button className="btn btn-outline-primary btn-sm">
                    Change Photo
                  </button>
                </div>
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Name</label>

                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>

                    <p className="form-control-plaintext">{user.email}</p>

                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Phone</label>

                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Bio</label>
                  </div>
                </div>
              </div>
            </div>
            <div className="card-footer">
              {user.books?.map((book) => (
                <div key={book.id} className="mb-2">
                  <h5 className="mb-1">{book.title}</h5>
                  <p className="mb-0 text-muted">by {book.author}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
