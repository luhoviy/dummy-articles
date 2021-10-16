import { ArticleCategory, SearchConfig } from './models';

export const ARTICLE_CATEGORIES_LIST = [
  ArticleCategory.SCIENCE,
  ArticleCategory.ARTS,
  ArticleCategory.PRODUCTIVITY,
  ArticleCategory.MEDIA,
  ArticleCategory.EDUCATION,
  ArticleCategory.SPORT,
  ArticleCategory.BUSINESS,
  ArticleCategory.TRAVEL,
];

export const InitialSearchConfig: SearchConfig = {
  selectedCategory: 'ALL',
  sortOrder: 'desc',
  searchKeyword: '',
};
