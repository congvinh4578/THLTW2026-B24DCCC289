import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import PostDetail from './pages/PostDetail';
import About from './pages/About';
import AdminPosts from './pages/AdminPosts';
import AdminTags from './pages/AdminTags';

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog/:slug" element={<PostDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/admin/posts" element={<AdminPosts />} />
          <Route path="/admin/tags" element={<AdminTags />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
