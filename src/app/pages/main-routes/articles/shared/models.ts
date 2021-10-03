import { User } from '../../../../authentication/shared/auth.model';

export class Article {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  coverPhotoUrl: string;
  createdAt: string;
  editedAt: string = null;
  authorId: string;

  // for client side
  author?: User;
}

export enum ArticleCategory {
  SCIENCE = 'SCIENCE',
  ARTS = 'ARTS',
  PRODUCTIVITY = 'PRODUCTIVITY',
  MEDIA = 'MEDIA',
  EDUCATION = 'EDUCATION',
  SPORT = 'SPORT',
  BUSINESS = 'BUSINESS',
  TRAVEL = 'TRAVEL',
}

export interface SearchConfig {
  selectedCategory: ArticleCategory | 'ALL';
  sortOrder: 'asc' | 'desc';
}
