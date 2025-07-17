import React, { useState, useEffect } from 'react';
import { moviesAPI, genresAPI, actorsAPI } from '../services/api';
import { Movie, Genre, Actor, MovieCreate } from '../types';
import { Plus, Edit2, Trash2, Film, Star, Calendar } from 'lucide-react';

const Movies: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [actors, setActors] = useState<Actor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [formData, setFormData] = useState<MovieCreate>({
    title: '',
    genre: 0,
    actors: [],
    release_date: '',
    resume: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [moviesData, genresData, actorsData] = await Promise.all([
        moviesAPI.getAll(),
        genresAPI.getAll(),
        actorsAPI.getAll(),
      ]);
      
      setMovies(moviesData);
      setGenres(genresData);
      setActors(actorsData);
    } catch (err) {
      setError('Erro ao carregar dados');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const movieData = {
        ...formData,
        release_date: formData.release_date || null,
        resume: formData.resume || null,
      };

      if (editingMovie) {
        await moviesAPI.update(editingMovie.id, movieData);
      } else {
        await moviesAPI.create(movieData);
      }
      
      await fetchData();
      setIsModalOpen(false);
      setEditingMovie(null);
      setFormData({
        title: '',
        genre: 0,
        actors: [],
        release_date: '',
        resume: '',
      });
    } catch (err) {
      setError('Erro ao salvar filme');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setFormData({
      title: movie.title,
      genre: movie.genre.id,
      actors: movie.actors.map(actor => actor.id),
      release_date: movie.release_date || '',
      resume: movie.resume || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await moviesAPI.delete(id);
        await fetchData();
      } catch (err) {
        setError('Erro ao excluir filme');
      }
    }
  };

  const openCreateModal = () => {
    setEditingMovie(null);
    setFormData({
      title: '',
      genre: 0,
      actors: [],
      release_date: '',
      resume: '',
    });
    setIsModalOpen(true);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleActorChange = (actorId: number, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        actors: [...formData.actors, actorId],
      });
    } else {
      setFormData({
        ...formData,
        actors: formData.actors.filter(id => id !== actorId),
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Filmes</h1>
          <p className="mt-1 text-sm text-gray-600">
            Gerencie os filmes do sistema
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Filme
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {movies.map((movie) => (
          <div key={movie.id} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Film className="h-8 w-8 text-indigo-600" />
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(movie)}
                    className="text-indigo-600 hover:text-indigo-900 p-1"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(movie.id)}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {movie.title}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="font-medium">Gênero:</span>
                  <span className="ml-2">{movie.genre.name}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
                
                {movie.rate && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-500" />
                    <span>{movie.rate}/5</span>
                  </div>
                )}
                
                <div>
                  <span className="font-medium">Atores:</span>
                  <div className="mt-1">
                    {movie.actors.map((actor, index) => (
                      <span key={actor.id} className="text-xs bg-gray-100 rounded-full px-2 py-1 mr-1 mb-1 inline-block">
                        {actor.name}
                      </span>
                    ))}
                  </div>
                </div>
                
                {movie.resume && (
                  <div>
                    <span className="font-medium">Resumo:</span>
                    <p className="mt-1 text-xs text-gray-500 line-clamp-3">
                      {movie.resume}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-10 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                {editingMovie ? 'Editar Filme' : 'Novo Filme'}
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Título *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gênero *
                  </label>
                  <select
                    required
                    value={formData.genre}
                    onChange={(e) => setFormData({ ...formData, genre: Number(e.target.value) })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  >
                    <option value={0}>Selecione um gênero...</option>
                    {genres.map((genre) => (
                      <option key={genre.id} value={genre.id}>
                        {genre.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Data de Lançamento
                  </label>
                  <input
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Atores
                  </label>
                  <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2">
                    {actors.map((actor) => (
                      <label key={actor.id} className="flex items-center space-x-2 py-1">
                        <input
                          type="checkbox"
                          checked={formData.actors.includes(actor.id)}
                          onChange={(e) => handleActorChange(actor.id, e.target.checked)}
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">{actor.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Resumo
                  </label>
                  <textarea
                    rows={3}
                    value={formData.resume}
                    onChange={(e) => setFormData({ ...formData, resume: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder="Descreva o filme..."
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Movies;