import { useContext, useEffect, useState } from 'react'
import BookCard from '../components/BookCard'
import './Home.css'
import { deleteBook, getBooks } from '../services/books.service'
import ThemeContext from '../contexts/themeContext'

const Home = () => {
  const [books, setBooks] = useState([])
  const { word } = useContext(ThemeContext);

  console.log('Context word Value:', word);

  useEffect(() => {
    getBooks()
      .then((response) => {
        console.log(response)
        setBooks(response)
      })
      .catch((error) => {
        console.error('Error fetching books:', error)
      })
  }, [])

  const handleDelete = (id) => {
    console.log('entro? en handleDelete?', id)
    deleteBook(id)
      .then(() => {
        console.log('Book deleted?:', id)
        setBooks(books.filter((book) => book.id !== id))
      })
      .catch((error) => {
        console.error('Error deleting book:', error)
      })
  }
  console.log(books)
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Biblioteca Digital</h1>
        <p>Descubre nuestra colección de libros</p>
      </header>

      <div className="books-grid">
        {books.map((book) => (
          <BookCard
            onDelete={() => {
              handleDelete(book.id)
            }}
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            year={book.year}
            user={book.user}
            image={book.image}
          />
        ))}
      </div>
    </div>
  )
}

export default Home
