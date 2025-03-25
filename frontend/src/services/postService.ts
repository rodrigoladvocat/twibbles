import { apiService, ApiResponse } from '@/lib/api';

// Interface definitions based on backend models
export interface Post {
  id: number;
  user_id: number;
  text: string;
  location?: string;
  hashtags?: string;
  date_time?: string;
  user_name?: string; // Added for frontend display
}

export interface PostCreate {
  text: string;
  location: string;
  hashtags: string;
}

// Post service
export const postService = {
  // Get feed - posts from followed users
  getFeed: async (userId: number): Promise<Post[]> => {
    try {
      const response = await apiService.get<Post[]>(`/post/feed/${userId}`);
      console.log(`Feed response for user ${userId}:`, response);
      
      if (response && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching feed:', error);
      return [];
    }
  },

  // Get posts by user ID
  getPostsByUserId: async (userId: number): Promise<Post[]> => {
    try {
      // Backend endpoint expects sort_by_comment parameter
      const response = await apiService.get<Post[]>(`/post/${userId}/posts`, { sort_by_comment: false });
      console.log('User posts response:', response);
      
      if (response && response.data) {
        return response.data;
      }
      
      return [];
    } catch (error) {
      console.error('Error fetching user posts:', error);
      return [];
    }
  },

  // Create a new post
  createPost: async (userId: number, text: string, location: string = "", hashtags: string = ""): Promise<Post | null> => {
    try {
      // Match the backend expected structure
      const postData: PostCreate = {
        text,
        location,
        hashtags
      };
      
      console.log(`Creating post for user ${userId}:`, postData);
      
      const response = await apiService.post<Post>(
        `/post/${userId}/post`, 
        postData
      );
      
      console.log('Post creation response:', response);
      
      if (response && response.status_code === 201 && response.data) {
        return response.data;
      }
      
      return null;
    } catch (error) {
      console.error('Error creating post:', error);
      return null;
    }
  },

  // Delete a post
  deletePost: async (userId: number, postId: number): Promise<boolean> => {
    try {
      const response = await apiService.delete<any>(`/post/${userId}/posts/${postId}`);
      return response && response.status_code === 200;
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  },
}; 