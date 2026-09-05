import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { reviewsControllers } from './reviews.controllers';
import {
  createReviewSchema,
  updateReviewSchema,
  reviewParamsSchema,
  paginationQuerySchema,
} from './reviews.validators';
import { validate } from '../../middlewares/validator';
import { auth } from '../../middlewares/auth';

const router = Router();

router.get(
  '/',
  auth(Role.DEVELOPER),
  validate(paginationQuerySchema, 'query'),
  reviewsControllers.getMyReviews,
);

router.get(
  '/:reviewId',
  auth(Role.DEVELOPER),
  validate(reviewParamsSchema, 'params'),
  reviewsControllers.getReviewById,
);

router.post(
  '/',
  auth(Role.DEVELOPER),
  validate(createReviewSchema),
  reviewsControllers.createReview,
);

router.patch(
  '/:reviewId',
  auth(Role.DEVELOPER),
  validate(reviewParamsSchema, 'params'),
  validate(updateReviewSchema),
  reviewsControllers.updateReview,
);

router.delete(
  '/:reviewId',
  auth(Role.DEVELOPER),
  validate(reviewParamsSchema, 'params'),
  reviewsControllers.deleteReview,
);

export const reviewsRoutes = router;
