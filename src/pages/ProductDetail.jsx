import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById, updateProductStatus } from '../services/productService';
import { createOrder } from '../services/orderService';
import AuthContext from '../contexts/authContext';
import "../styles/productDetail.css";
import { getReviewsByProduct, createReview } from '../services/reviewService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        const res = await getProductById(id);
        const data = res?.data || res;
        setProduct(data);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
      } 
    };
    load();
  }, [id]);

  // --- CARGAR COMENTARIOS ---
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await getReviewsByProduct(id);
        const data = res?.data || res;
        setReviews(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setReviews([]);
      }
    };
    loadReviews();
  }, [id]);

  // --- FUNCION DE COMPRAR PRODUCTO ---
  const handleBuy = async () => {
    try {
      const orderData = {
        product: product._id || product.id,
        seller: product.seller?._id || product.seller?.id,
        type: 'purchase',
        quantity: 1,
      };
      
      await createOrder(orderData);
      
      // -- CAMBIAR STATUS A SOLD --
      await updateProductStatus(product.id || product._id, 'sold');
      
      const updatedRes = await getProductById(id);
      const updatedData = updatedRes?.data || updatedRes;
      setProduct(updatedData);
      
      alert('¡Venta realizada!');
      navigate('/profile');
    } catch (err) {
      setError(err);
    }
  };

    // --- FUNCION DE RESERVAR PRODUCTO ---
  const handleReserve = async () => {
    try {
      const orderData = {
        product: product._id || product.id,
        seller: product.seller?._id || product.seller?.id,
        type: 'reservation',
        quantity: 1,
      };
      
      await createOrder(orderData);
      
      // -- CAMBIAR STATUS DE PRODUCTO A RESERVADO --
      await updateProductStatus(product.id || product._id, 'archived');
      
      const updatedRes = await getProductById(id);
      const updatedData = updatedRes?.data || updatedRes;
      setProduct(updatedData);
      
      alert('¡Reserva realizada!');
      navigate('/profile');
    } catch (err) {
      setError(err);
    }
  };

  // --- CREAR RESEÑA ---
  const handleSubmitReview = async (e) => {
    e.preventDefault();

    try {
      const username = user.name || user.email || 'Usuario';
      const commentPayload = `${username} : ${newComment.trim()}`;
      await createReview({ productId: id, comment: commentPayload });

      // -- CARGAR RESEÑAS --
      const res = await getReviewsByProduct(id);
      const data = res?.data || res;
      setReviews(Array.isArray(data) ? data : []);
      setNewComment('');
    } catch (err) {
      console.error(err);
    }
  };

  const { title, description, price, images = [], category, seller, status } = product;

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-lg-8">
          {/* - CAMPO IMAGEN - */}
          <div className="mb-4">
            {images.length > 0 ? (
              <img 
                src={images[0]} 
                alt={title} 
                className="img-fluid rounded"
                style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
              />
            ) : (
              <div 
                className="bg-light rounded d-flex align-items-center justify-content-center"
                style={{ height: '400px' }}
              >
                <span className="text-muted">SIN IMAGEN</span>
              </div>
            )}
          </div>
          {/* - COMENTARIOS - */}
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title">Comentarios</h5>
              <div>
                {reviews.length === 0 && <p className="text-muted">Sé el primero en comentar.</p>}
                {reviews.map((r) => (
                  <div key={r.id || r._id} className="mb-2">
                    <div className="border rounded p-2">
                      <small className="text-muted">{r.comment}</small>
                    </div>
                  </div>
                ))}
              </div>
              

              {/* - SOLO COMENTAN LOS USUARIOS LOGUEADOS - */}
              {user ? (
                <form onSubmit={handleSubmitReview} className="mt-3">
                  <div className="mb-2">
                    <textarea
                      className="form-control"
                      rows={3}
                      placeholder="Escribe tu reseña..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <button className="btn btn-primary" type="submit">
                      Enviar
                    </button>
                  </div>
                </form>
              ) : (
                <p className="text-muted mt-3">Inicia sesión.</p>
              )}
            </div>
          </div>

          {/* - INFO DEL PRODUCTO - */}
          <div className="card mb-4">
            <div className="card-body">
              <h1 className="card-title mb-3">{title}</h1>
              
              <div className="mb-3">
                <span className="badge bg-info">{category?.name}</span>
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
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="col-lg-4">
          <div className="card sticky-top">
            <div className="card-body">
              <h5 className="card-title">Detalles</h5>
              <hr />
              
              <div className="mb-3">
                <p className="text-muted mb-1">Price</p>
                <h4 className="text-success">€{price}</h4>
              </div>

              <div className="mb-3">
                <p className="text-muted mb-1">Category</p>
                <p className="fw-bold">{category?.name}</p>
              </div>

              <div className="mb-3">
                <p className="text-muted mb-1">Status</p>
                <p className="fw-bold">{status || 'published'}</p>
              </div>

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={handleBuy}
                >
                  COMPRAR
                </button>
                <button 
                  className="btn btn-warning btn-lg" 
                  onClick={handleReserve}
                >
                  RESERVAR
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
