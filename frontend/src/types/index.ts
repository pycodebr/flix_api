export interface User {
  id: number;
  username: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface TokenResponse {
  access: string;
  refresh: string;
}

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  name: string;
  birthday: string | null;
  nationality: 'USA' | 'BRAZIL' | null;
}

export interface Movie {
  id: number;
  title: string;
  genre: Genre;
  actors: Actor[];
  release_date: string | null;
  rate: number | null;
  resume: string | null;
}

export interface MovieCreate {
  title: string;
  genre: number;
  actors: number[];
  release_date: string | null;
  resume: string | null;
}

export interface Review {
  id: number;
  movie: number;
  stars: number;
  comment: string | null;
}

export interface MovieStats {
  total_movies: number;
  movies_by_genre: Array<{
    genre__name: string;
    count: number;
  }>;
  total_reviews: number;
  average_stars: number;
}