import React, { useState, useEffect } from 'react';
import { moviesAPI } from '../services/api';
import { MovieStats } from '../types';
import { Film, Users, Tag, Star, TrendingUp } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<MovieStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await moviesAPI.getStats();
        setStats(data);
      } catch (err) {
        setError('Erro ao carregar estatísticas');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
        {error}
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total de Filmes',
      value: stats?.total_movies || 0,
      icon: Film,
      color: 'bg-blue-500',
    },
    {
      title: 'Total de Avaliações',
      value: stats?.total_reviews || 0,
      icon: Star,
      color: 'bg-yellow-500',
    },
    {
      title: 'Média de Estrelas',
      value: stats?.average_stars?.toFixed(1) || '0.0',
      icon: TrendingUp,
      color: 'bg-green-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          Visão geral do sistema de gerenciamento de filmes
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`${stat.color} rounded-md p-3`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">
                        {stat.title}
                      </dt>
                      <dd className="text-lg font-medium text-gray-900">
                        {stat.value}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Movies by Genre */}
      {stats?.movies_by_genre && stats.movies_by_genre.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
              Filmes por Gênero
            </h3>
            <div className="space-y-3">
              {stats.movies_by_genre.map((genre, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Tag className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-sm font-medium text-gray-900">
                      {genre.genre__name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="bg-gray-200 rounded-full h-2 w-32 mr-3">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${(genre.count / (stats.total_movies || 1)) * 100}%`,
                        }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-8 text-right">
                      {genre.count}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;