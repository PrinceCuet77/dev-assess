import { z } from 'zod';

const splitTags = (value: string) =>
  Array.from(
    new Set(
      value
        .split(',')
        .map((tag) => tag.trim().toLowerCase())
        .filter((tag) => tag.length > 0),
    ),
  );

const tagsSchema = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value ? splitTags(value) : undefined));

export const getAllAssessmentsSchema = z.object({
  tags: tagsSchema,
  minPrice: z.coerce.number().nonnegative().optional(),
  maxPrice: z.coerce.number().nonnegative().optional(),
  search: z.string().trim().min(1).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z
    .enum(['title', 'price', 'createdAt', 'duration'])
    .default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const getAssessmentByIdSchema = z.object({
  assessmentId: z.string().uuid('Invalid assessment ID format'),
});

export const getAssessmentReviewsSchema = z.object({
  assessmentId: z.string().uuid('Invalid assessment ID format'),
});

export const getAssessmentReviewsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  sortBy: z.enum(['createdAt', 'rating']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
