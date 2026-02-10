import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import BookDetail from './pages/BookDetail'
import './App.css'
import NavBar from './components/NavBar'
import Register from './components/Register'
import Login from './components/Login'
import Profile from './pages/Profile'
import BookForm from './pages/BookForm'
import ProtectedRoute from './components/ProtectedRoute'
import UserList from './pages/UserList'
import ChatDetail from './pages/ChatDetail'



function App() {

  return (
    <Router>
      <NavBar />
      <div>
        <Routes>
          <Route path="/users" element={<ProtectedRoute><UserList /></ProtectedRoute>} />
          <Route path="/" element={<Home />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/books/create" element={<ProtectedRoute><BookForm /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><ChatDetail></ChatDetail></ProtectedRoute>} />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
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
