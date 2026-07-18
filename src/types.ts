export type Category =
  | 'Bikes'
  | 'Cars'
  | 'Jewellery'
  | 'Electronics'
  | 'Mobile Phones'
  | 'Shoes'
  | 'Real Estate'
  | 'Manuscripts & Books';

export type Condition = 'Mint' | 'Near Mint' | 'Excellent' | 'Fine' | 'Good' | 'Very Good' | 'Fair' | 'Poor';

export const CATEGORIES: Category[] = [
  
  'Bikes',
   'Cars',
   'Jewellery',
   'Electronics',
   'Mobile Phones',
   'Shoes',
   'Real Estate',
   'Manuscripts & Books'
];

export const CONDITIONS: Condition[] = ['Mint', 'Near Mint', 'Excellent', 'Fine', 'Good', "Very Good" ,'Fair', 'Poor'];

export interface Listing {
  id: string;
  title: string;
  category: Category;
  condition: Condition;
  price: number;
  image: string;
  seller: string;
  location: string;
  createdAt: string;
  description: string;
}

export interface FeedUser {
  name: string;
  handle: string;
  avatar: string;
}

export interface Comment {
  id: string;
  user: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Post {
  id: string;
  user: FeedUser;
  image: string;
  caption: string;
  category: Category;
  likes: number;
  liked: boolean;
  comments: Comment[];
  saved: boolean;
  createdAt: string;
}

export type CollectionKey = 'owned' | 'wishlist' | 'selling';

export const COLLECTION_LABELS: Record<CollectionKey, string> = {
  owned: 'Owned',
  wishlist: 'Wishlist',
  selling: 'Selling',
};

export interface CollectionItem {
  id: string; 
  listingId: string;
  collection: CollectionKey;
  title: string;
  category: Category;
  image: string;
  price: number;
  addedAt: string; 
  estimatedValue: number;
}