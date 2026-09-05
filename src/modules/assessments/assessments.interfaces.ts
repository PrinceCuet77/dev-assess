export interface IGetAllAssessmentsQuery {
  tags?: string[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'title' | 'price' | 'createdAt' | 'duration';
  sortOrder?: 'asc' | 'desc';
}

export interface IGetAssessmentReviewsQuery {
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'rating';
  sortOrder?: 'asc' | 'desc';
}
