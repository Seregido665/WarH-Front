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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setError(null);
        setLoading(true);
        const res = await getProductById(id);
        const data = res?.data || res;
        setProduct(data);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError(err);
      } finally {
        setLoading(false);
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
    // Validar que usuario esté logueado
    if (!user) {
      alert('Debes iniciar sesión para comprar');
      navigate('/login');
      return;
    }

    // Validar que no sea creador
    const sellerId = product.seller?.id || product.seller?._id || product.seller;
    const userId = user.id || user._id;
    if (String(sellerId) === String(userId)) {
      alert('No puedes comprar tu propio producto');
      return;
    }

    // Validar que no esté vendido o reservado
    if (product.status === 'sold' || product.status === 'archived') {
      alert('Este producto no está disponible');
      return;
    }

    setActionLoading(true);
    try {
      const orderData = {
        product: product._id || product.id,
        seller: sellerId,
        type: 'purchase',
        quantity: 1,
      };
      
      await createOrder(orderData);
      await updateProductStatus(product.id || product._id, 'sold');
      
      const updatedRes = await getProductById(id);
      const updatedData = updatedRes?.data || updatedRes;
      setProduct(updatedData);
      
      alert('¡Compra realizada exitosamente!');
      navigate('/profile');
    } catch (err) {
      console.error('Error al comprar:', err);
      alert('Error al procesar la compra: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
    }
  };

  // --- FUNCION DE RESERVAR PRODUCTO ---
  const handleReserve = async () => {
    // Validar que usuario esté logueado
    if (!user) {
      alert('Debes iniciar sesión para reservar');
      navigate('/login');
      return;
    }

    // Validar que no sea el dueño
    const sellerId = product.seller?.id || product.seller?._id || product.seller;
    const userId = user.id || user._id;
    if (String(sellerId) === String(userId)) {
      alert('No puedes reservar tu propio producto');
      return;
    }

    // Validar que no esté vendido o reservado
    if (product.status === 'sold' || product.status === 'archived') {
      alert('Este producto no está disponible');
      return;
    }

    setActionLoading(true);
    try {
      const orderData = {
        product: product._id || product.id,
        seller: sellerId,
        type: 'reservation',
        quantity: 1,
      };
      
      await createOrder(orderData);
      await updateProductStatus(product.id || product._id, 'archived');
      
      const updatedRes = await getProductById(id);
      const updatedData = updatedRes?.data || updatedRes;
      setProduct(updatedData);
      
      alert('¡Reserva realizada exitosamente!');
      navigate('/profile');
    } catch (err) {
      console.error('Error al reservar:', err);
      alert('Error al procesar la reserva: ' + (err.response?.data?.message || err.message));
    } finally {
      setActionLoading(false);
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

  const { title, price, images = [], category, status } = product || {};

  if (loading) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info">Cargando producto...</div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">Error al cargar el producto</div>
      </div>
    );
  }

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

        </div>

        {/* LATERAL */}
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

              {(status === 'sold' || status === 'archived') && (
                <div className="alert alert-warning mb-3" role="alert">
                  {status === 'sold' ? '❌ Este producto ya ha sido vendido' : '⚠️ Este producto se encuentra reservado'}
                </div>
              )}

              <div className="d-grid gap-2">
                <button 
                  className="btn btn-success btn-lg"
                  onClick={handleBuy}
                  disabled={actionLoading || product.status !== 'published'}
                >
                  {actionLoading ? 'Procesando...' : 'COMPRAR'}
                </button>
                <button 
                  className="btn btn-warning btn-lg" 
                  onClick={handleReserve}
                  disabled={actionLoading || product.status !== 'published'}
                >
                  {actionLoading ? 'Procesando...' : 'RESERVAR'}
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
