import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { getToken } from './api';
import Login from './Login';
import ResourceList from './ResourceList';

export default function App() {
  const isAuthenticated = !!getToken();

  const loginSuccess = () => window.location.href = '/';

  const resourceFields = {
    actors: [
      { name: 'name', label: 'Name' },
      { name: 'birthday', label: 'Birthday' },
      { name: 'nationality', label: 'Nationality' },
    ],
    genres: [
      { name: 'name', label: 'Name' },
    ],
    movies: [
      { name: 'title', label: 'Title' },
      { name: 'genre', label: 'Genre ID' },
      { name: 'release_date', label: 'Release Date' },
      { name: 'actors', label: 'Actor IDs (comma separated)' },
      { name: 'resume', label: 'Resume' },
    ],
    reviews: [
      { name: 'movie', label: 'Movie ID' },
      { name: 'stars', label: 'Stars' },
      { name: 'comment', label: 'Comment' },
    ],
  };

  return (
    <Router>
      <nav>
        <Link to="/actors">Actors</Link> |{' '}
        <Link to="/genres">Genres</Link> |{' '}
        <Link to="/movies">Movies</Link> |{' '}
        <Link to="/reviews">Reviews</Link>
      </nav>
      <Routes>
        <Route path="/login" element={<Login onLogin={loginSuccess} />} />
        <Route path="/actors" element={isAuthenticated ? <ResourceList resource="actors" fields={resourceFields.actors} /> : <Navigate to="/login" />} />
        <Route path="/genres" element={isAuthenticated ? <ResourceList resource="genres" fields={resourceFields.genres} /> : <Navigate to="/login" />} />
        <Route path="/movies" element={isAuthenticated ? <ResourceList resource="movies" fields={resourceFields.movies} /> : <Navigate to="/login" />} />
        <Route path="/reviews" element={isAuthenticated ? <ResourceList resource="reviews" fields={resourceFields.reviews} /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to="/actors" />} />
      </Routes>
    </Router>
  );
}
