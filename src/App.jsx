import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import CreateArticle from './pages/CreateArticle'
import Store from './pages/Store'
import ProductDetail from './pages/ProductDetail'
import EditProduct from './pages/EditProduct'



function App() {

  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/" element={<Store />} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />

          <Route path="/products/create" element={
            <ProtectedRoute>
              <CreateArticle />
            </ProtectedRoute>
          } />

          <Route path="/store" element={<Store />} />

          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/products/:id/edit" element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          } />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
