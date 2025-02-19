import { auth, db, storage } from "./firebase";
import {
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  where,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { User, Post, Comment } from '../types';

// Auth functions
export const logoutUser = () => signOut(auth);

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google", error);
    throw error;
  }
};

// Firestore functions
export const addDocument = (collectionName: string, data: any) =>
  addDoc(collection(db, collectionName), data);

export const getDocuments = async (collectionName: string) => {
  const querySnapshot = await getDocs(collection(db, collectionName));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const updateDocument = (collectionName: string, id: string, data: any) =>
  updateDoc(doc(db, collectionName, id), data);

export const deleteDocument = (collectionName: string, id: string) =>
  deleteDoc(doc(db, collectionName, id));

// Storage functions
export const uploadFile = async (file: File, path: string) => {
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  return getDownloadURL(storageRef);
};

// User Functions
export async function createUserProfile(user: User) {
  const userRef = doc(db, 'users', user.uid);
  await updateDoc(userRef, {
    ...user,
    followers: [],
    following: [],
  });
}

export async function getUserProfile(uid: string) {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  return userSnap.data() as User;
}

export async function updateUserProfile(uid: string, data: Partial<User>) {
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, data);
}

// Post Functions
export async function createPost(post: Omit<Post, 'id' | 'createdAt'>, imageFile?: File) {
  let imageUrl;
  if (imageFile) {
    const imageRef = ref(storage, `posts/${Date.now()}_${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    imageUrl = await getDownloadURL(imageRef);
  }

  const postRef = await addDoc(collection(db, 'posts'), {
    ...post,
    imageUrl,
    likes: [],
    comments: [],
    createdAt: serverTimestamp(),
  });

  return postRef.id;
}

export async function getFeedPosts() {
  const postsRef = collection(db, 'posts');
  const q = query(postsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
}

export async function getUserPosts(userId: string) {
  const postsRef = collection(db, 'posts');
  const q = query(
    postsRef, 
    where('authorId', '==', userId),
    orderBy('createdAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as Post[];
}

// Like and Comment Functions
export async function toggleLike(postId: string, userId: string) {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  const post = postSnap.data() as Post;
  
  const likes = post.likes || [];
  const newLikes = likes.includes(userId)
    ? likes.filter(id => id !== userId)
    : [...likes, userId];
    
  await updateDoc(postRef, { likes: newLikes });
}

export async function addComment(
  postId: string, 
  comment: Omit<Comment, 'id' | 'createdAt'>
) {
  const postRef = doc(db, 'posts', postId);
  const postSnap = await getDoc(postRef);
  const post = postSnap.data() as Post;
  
  const newComment = {
    ...comment,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  
  await updateDoc(postRef, {
    comments: [...post.comments, newComment]
  });
  
  return newComment;
}
