export interface User {
  id: number;
  username: string;
  email: string;
  created_at: string;
}

export interface Feed {
  id: number;
  user_id: number;
  title: string;
  url: string;
  description?: string;
  category?: string;
  last_fetched?: string;
  created_at: string;
}

export interface Article {
  id: number;
  feed_id: number;
  title: string;
  link: string;
  content?: string;
  author?: string;
  published_at?: string;
  fetched_at: string;
  is_read: boolean;
  is_starred: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
