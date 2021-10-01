export class Article {
  id: string;
  title: string;
  description: string;
  category: ArticleCategory;
  firebasePhotoUrl: string = null;
  externalPhotoUrl: string = null;
  useExternalPhotoUrl: boolean = false;
  createdAt: string = new Date().toUTCString();
  editedAt: string = null;
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
  OTHER = 'OTHER',
}

export interface SearchConfig {
  selectedCategory: ArticleCategory | 'ALL';
  sortOrder: 'asc' | 'desc';
}
