import React from 'react';
import { Link } from 'react-router-dom';

const Product = ({ item }) => {
  const { title, description, price, images = [], category } = item;

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
            <div style={{ display: 'flex', gap: '8px' }}>
              <Link 
                to={`/products/${item.id || item._id}`} 
                className="btn btn-primary btn-sm"
              >
                Detalles
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product;
