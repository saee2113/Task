export interface User {
    id: string;
    email: string;
    role: 'normal' | 'admin';
  }
  
  export interface Store {
    _id: string;
    name: string;
    description?: string;
    createdBy: { email: string };
  }
  
  export interface Rating {
    _id: string;
    userId: string;
    storeId: string;
    rating: number;
  }