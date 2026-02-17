import { Link } from 'react-router-dom';
import { deleteProduct } from '../services/productService';
import "../styles/product.css";

const Product = ({ item, isOwner = false, onDelete }) => {
  const { title, description, price, images = [], category } = item;

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await deleteProduct(item.id || item._id);
        if (onDelete) {
          onDelete(item.id || item._id);
        }
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  return (
    <div className="card mb-3">
      <div className="row g-0">
        <div className="col-md-4">
          <img src={images[0] || 'https://via.placeholder.com/300'} className="img-fluid rounded-start" alt={title} />
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{title}</h5>
            <p className="card-text text-muted">{category?.name || ''}</p>
            <p className="card-text">{description}</p>
            <p className="card-text"><strong>€{price}</strong></p>
            <div>
              <Link 
                to={`/products/${item.id || item._id}`} 
                className="btn btn-primary btn-sm"
              >
                Comprar / Reservar
              </Link>
              
            </div>
            {isOwner && (
                <Link
                  to={`/products/${item.id || item._id}/edit`}
                  className="btn btn-secondary btn-sm mt-2 me-5"
                >
                  Editar
                </Link>
              )}
              {isOwner && (
                <button
                  onClick={handleDelete}
                  className="btn btn-danger btn-sm mt-2"
                >
                  Eliminar
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
