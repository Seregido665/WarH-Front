import { useContext } from 'react'
import './Home.css'
import ThemeContext from '../contexts/themeContext'

const Home = () => {
  const { word } = useContext(ThemeContext);

  console.log('Context word Value:', word);
  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Biblioteca Digital</h1>
        <p>Descubre nuestra colección de libros</p>
      </header>

      <div className="books-grid">
        {/* Libros serían mostrados aquí */}
      </div>
    </div>
  )
}

export default Home
