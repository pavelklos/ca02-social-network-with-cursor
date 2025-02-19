export interface User {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  bio?: string;
  followers?: string[];
  following?: string[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  imageUrl?: string;
  likes: string[];
  comments: Comment[];
  createdAt: number;
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorPhoto: string;
  content: string;
  createdAt: number;
} 