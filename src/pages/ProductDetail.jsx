import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProductStatus } from '../services/productService';
import { createOrder } from '../services/orderService';
import AuthContext from '../contexts/authContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [buyingLoading, setBuyingLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getProductById(id);
        const data = res?.data || res;
        setProduct(data);
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to load product');
        console.error('Failed to load product', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBuy = async () => {
    if (!user) {
      alert('Please log in to purchase items');
      return;
    }

    if (!product) {
      alert('Product not found');
      return;
    }

    setBuyingLoading(true);
    try {
      // Create order
      const orderData = {
        product: product.id || product._id,
        seller: product.seller?._id || product.seller,
        type: 'purchase',
        quantity: 1,
      };
      
      await createOrder(orderData);
      
      // Update product status to sold
      await updateProductStatus(product.id || product._id, 'sold');
      
      // Refresh product data
      const updatedRes = await getProductById(id);
      const updatedData = updatedRes?.data || updatedRes;
      setProduct(updatedData);
      
      alert('Product purchased successfully!');
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message || 'Purchase failed';
      setError(errorMsg);
      alert(errorMsg);
    } finally {
      setBuyingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mt-5">
        <p className="text-center">Loading product...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" role="alert">
          Product not found
        </div>
        <button className="btn btn-primary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    );
  }

  const { title, description, price, images = [], category, seller, status, createdAt } = product;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          {/* Product Images */}
          <div className="mb-4">
            {images.length > 0 ? (
              <img 
                src={images[0]} 
                alt={title} 
                className="img-fluid rounded"
                style={{ maxHeight: '500px', objectFit: 'cover', width: '100%' }}
              />
            ) : (
              <div 
                className="bg-light rounded d-flex align-items-center justify-content-center"
                style={{ height: '500px' }}
              >
                <span className="text-muted">No image available</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="card-title mb-3">{title}</h1>
              
              <div className="mb-3">
                <span className="badge bg-info">{category?.name || 'Uncategorized'}</span>
                <span className="badge bg-secondary ms-2">{status || 'published'}</span>
              </div>

              <p className="card-text">{description}</p>

              <div className="mb-3">
                <h3 className="text-success">€{price}</h3>
              </div>

              {seller && (
                <div className="card bg-light mb-3">
                  <div className="card-body">
                    <h6 className="card-title">Seller</h6>
                    <div className="d-flex align-items-center">
                      {seller.avatar && (
                        <img 
                          src={seller.avatar} 
                          alt={seller.name}
                          className="rounded-circle me-3"
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                        />
                      )}
                      <div>
                        <p className="mb-0"><strong>{seller.name || seller.email}</strong></p>
                        <p className="mb-0 text-muted">{seller.email}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {createdAt && (
                <p className="text-muted">
                  <small>Posted on {new Date(createdAt).toLocaleDateString()}</small>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card sticky-top">
            <div className="card-body">
              <h5 className="card-title">Product Details</h5>
              <hr />
              
              <div className="mb-3">
                <p className="text-muted mb-1">Price</p>
                <h4 className="text-success">€{price}</h4>
              </div>

              <div className="mb-3">
                <p className="text-muted mb-1">Category</p>
                <p className="fw-bold">{category?.name || 'Not specified'}</p>
              </div>

              <div className="mb-3">
                <p className="text-muted mb-1">Status</p>
                <p className="fw-bold">{status || 'published'}</p>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg" 
                  disabled={status !== 'published' || buyingLoading}
                  onClick={handleBuy}
                >
                  {buyingLoading ? 'Processing...' : 'Buy Now'}
                </button>
                <button className="btn btn-warning btn-lg" disabled={status !== 'published'}>
                  Reserve
                </button>
              </div>

              <button 
                className="btn btn-light w-100 mt-2"
                onClick={() => navigate(-1)}
              >
                Back to Store
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
