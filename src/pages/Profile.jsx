import { useContext, useEffect, useState } from "react";
import AuthContext from "../contexts/authContext";
import { useNavigate } from "react-router-dom";
import { getUserProducts } from "../services/productService";
import { getMyOrders } from "../services/orderService";
import { updateProfile } from "../services/userService";
import Product from "../components/Product";
import "../styles/profile.css";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [userProducts, setUserProducts] = useState([]);
  const [boughtProducts, setBoughtProducts] = useState([]);
  const [reservedProducts, setReservedProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('created'); // 'created', 'bought', 'reserved'
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar || 'https://via.placeholder.com/150');
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);

  const goToCreate = () => {
    navigate('/products/create');
  }

  // Update avatar URL when user changes
  useEffect(() => {
    if (user?.avatar) {
      setAvatarUrl(user.avatar);
      setImageLoadError(false);
    }
  }, [user?.avatar]);

  const handleAvatarClick = () => {
    document.getElementById('avatar-input').click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploadingAvatar(true);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      await updateProfile(formData);
      
      // Update local avatar URL with the new image
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatarUrl(event.target.result);
        setImageLoadError(false);
      };
      reader.readAsDataURL(file);
      
      alert('Avatar updated successfully!');
    } catch (err) {
      console.error('Failed to update avatar', err);
      alert('Error updating avatar');
    } finally {
      setUploadingAvatar(false);
      // Reset the input
      e.target.value = '';
    }
  };

  const handleImageError = () => {
    setImageLoadError(true);
  };

  // Load created products
  useEffect(() => {
    if (!user) return;
    
    const load = async () => {
      try {
        const res = await getUserProducts();
        const data = res?.data || res;
        const list = Array.isArray(data) ? data : data?.data || [];
        setUserProducts(list);
      } catch (err) {
        console.error('Failed to load user products', err);
      }
    };
    load();
  }, [user]);

  // Load bought and reserved products
  useEffect(() => {
    if (!user) return;
    
    const load = async () => {
      try {
        const res = await getMyOrders();
        const data = res?.data || res;
        const orders = Array.isArray(data) ? data : data?.data || [];
        
        // Separate orders by type
        const bought = orders.filter(o => o.type === 'purchase' || !o.type);
        const reserved = orders.filter(o => o.type === 'reservation');
        
        setBoughtProducts(bought);
        setReservedProducts(reserved);
      } catch (err) {
        console.error('Failed to load orders', err);
      }
    };
    load();
  }, [user]);

  if (!user) return null;

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-12">
          {/* User Info Section */}
          <div className="card shadow mb-4">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Profile</h3>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-4 text-center">
                  <div style={{ position: 'relative', display: 'inline-block' }}>
                    <img
                      src={imageLoadError ? 'https://via.placeholder.com/150' : avatarUrl}
                      alt="Profile"
                      className="img-fluid rounded-circle mb-3"
                      style={{ 
                        width: '150px', 
                        height: '150px', 
                        objectFit: 'cover',
                        cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                        opacity: uploadingAvatar ? 0.6 : 1,
                        transition: 'opacity 0.3s ease'
                      }}
                      onClick={handleAvatarClick}
                      onError={handleImageError}
                    />
                    {uploadingAvatar && (
                      <div style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        color: '#fff'
                      }}>
                        <div className="spinner-border spinner-border-sm" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </div>
                    )}
                    <input
                      id="avatar-input"
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={handleAvatarChange}
                      disabled={uploadingAvatar}
                    />
                  </div>
                  <p className="text-muted small mt-2">Click to change avatar</p>
                </div>
                <div className="col-md-8">
                  <div className="mb-3">
                    <label className="form-label fw-bold">Email</label>
                    <p className="form-control-plaintext">{user.email}</p>
                  </div>
                  <div className="mb-3">
                    <button className="btn btn-primary" onClick={goToCreate}>Create Article</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Tabs Section */}
          <div className="card shadow">
            <div className="card-header bg-secondary text-white">
              <h4 className="mb-0">Your Products & Purchases</h4>
            </div>
            
            {/* Tabs */}
            <ul className="nav nav-tabs" role="tablist" style={{ marginBottom: 0 }}>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'created' ? 'active' : ''}`}
                  onClick={() => setActiveTab('created')}
                  type="button"
                >
                  Created ({userProducts.length})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'bought' ? 'active' : ''}`}
                  onClick={() => setActiveTab('bought')}
                  type="button"
                >
                  Bought ({boughtProducts.length})
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button 
                  className={`nav-link ${activeTab === 'reserved' ? 'active' : ''}`}
                  onClick={() => setActiveTab('reserved')}
                  type="button"
                >
                  Reserved ({reservedProducts.length})
                </button>
              </li>
            </ul>

            <div className="card-body">
              {/* Created Products Tab */}
              {activeTab === 'created' && (
                <>
                  {userProducts.length === 0 && <p className="text-muted">You haven't created any products yet.</p>}
                  {userProducts
                    .map((p) => (
                    <Product 
                      key={p.id || p._id} 
                      item={p}
                      isOwner={true}
                      onDelete={(productId) => setUserProducts(userProducts.filter(prod => (prod.id || prod._id) !== productId))}
                    />
                  ))}
                </>
              )}
              
              {/* Bought Products Tab */}
              {activeTab === 'bought' && (
                <>
                  {boughtProducts.length === 0 && <p className="text-muted">You haven't bought any products yet.</p>}
                  {boughtProducts.map((order) => (
                    <Product 
                      key={order.product?._id || order.product} 
                      item={order.product || {}}
                    />
                  ))}
                </>
              )}
              
              {/* Reserved Products Tab */}
              {activeTab === 'reserved' && (
                <>
                  {reservedProducts.length === 0 && <p className="text-muted">You haven't reserved any products yet.</p>}
                  {reservedProducts.map((order) => (
                    <Product 
                      key={order.product?._id || order.product} 
                      item={order.product || {}}
                    />
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
