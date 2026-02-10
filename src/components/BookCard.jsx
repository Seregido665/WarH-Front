import React from 'react';
import { Link } from 'react-router-dom';
import './BookCard.css';

const BookCard = ({ title, year, user, author, onDelete, id, image }) => {
  const coverSrc = image || '/book-placeholder.svg';

  return (
    <div className="card">
      <div className="book-card-thumb">
        <img
          src={coverSrc}
          alt={image ? `Cover of ${title}` : 'Default book cover'}
          className="book-card-image"
          loading="lazy"
        />
      </div>
      <div className="card-body">
        <button onClick={onDelete} id="delete-btn" className="btn btn-danger">DELETE</button>
        <Link to={`/books/${id}`} className="btn btn-primary ms-1">VER</Link>
        <h5 className="card-title">{title}</h5>
        <p className="card-text">{author} - {year}</p>
        <p className="card-user">Añadido por: {user?.email}</p>
      </div>
    </div>
  );
};

export default BookCard;
