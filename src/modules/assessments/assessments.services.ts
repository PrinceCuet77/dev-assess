import { AssessmentStatus, Prisma } from '../../../generated/prisma/client';
import { NotFoundError } from '../../errors/ApiError';
import { prisma } from '../../lib/prisma';
import {
  IGetAllAssessmentsQuery,
  IGetAssessmentReviewsQuery,
} from './assessments.interfaces';

const assessmentCatalogSelect = {
  id: true,
  title: true,
  description: true,
  thumbnailUrl: true,
  tags: true,
  duration: true,
  price: true,
  passingPercentage: true,
  publishedAt: true,
  createdAt: true,
  creator: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
  reviews: {
    select: {
      id: true,
      rating: true,
      comment: true,
      developer: {
        select: {
          id: true,
          name: true,
          email: true,
        }
      }
    },
  },
} satisfies Prisma.AssessmentSelect;

const getAllAssessments = async (query: IGetAllAssessmentsQuery) => {
  const {
    tags,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const where: Prisma.AssessmentWhereInput = {
    status: AssessmentStatus.PUBLISHED,
  };

  if (tags && tags.length) {
    where.tags = { hasSome: tags };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    where.price = {};
    if (minPrice !== undefined) {
      where.price.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      where.price.lte = maxPrice;
    }
  }

  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { tags: { hasSome: [search.trim().toLowerCase()] } },
    ];
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [assessments, total] = await Promise.all([
    prisma.assessment.findMany({
      where,
      select: assessmentCatalogSelect,
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: Number(limit),
    }),
    prisma.assessment.count({ where }),
  ]);

  return {
    assessments,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getAssessmentById = async (assessmentId: string) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, status: AssessmentStatus.PUBLISHED },
    select: assessmentCatalogSelect,
  });

  if (!assessment) {
    throw new NotFoundError('Assessment is not found');
  }

  return assessment;
};

const getAssessmentReviews = async (
  assessmentId: string,
  query: IGetAssessmentReviewsQuery,
) => {
  const assessment = await prisma.assessment.findFirst({
    where: { id: assessmentId, status: AssessmentStatus.PUBLISHED },
  });

  if (!assessment) {
    throw new NotFoundError('Assessment is not found');
  }

  const {
    page = 1,
    limit = 10,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = query;

  const where: Prisma.ReviewWhereInput = {
    assessmentId,
    deletedAt: null,
  };

  const skip = (Number(page) - 1) * Number(limit);

  const [reviews, total] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        developer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip,
      take: Number(limit),
    }),
    prisma.review.count({ where }),
  ]);

  return {
    reviews,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const assessmentServices = {
  getAllAssessments,
  getAssessmentById,
  getAssessmentReviews,
};
