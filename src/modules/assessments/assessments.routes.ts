import { Router } from 'express';
import { assessmentControllers } from './assessments.controllers';
import {
  getAllAssessmentsSchema,
  getAssessmentByIdSchema,
  getAssessmentReviewsSchema,
  getAssessmentReviewsQuerySchema,
} from './assessments.validators';
import { validate } from '../../middlewares/validator';

const router = Router();

router.get(
  '/',
  validate(getAllAssessmentsSchema, 'query'),
  assessmentControllers.getAllAssessments,
);

router.get(
  '/:assessmentId',
  validate(getAssessmentByIdSchema, 'params'),
  assessmentControllers.getAssessmentById,
);

router.get(
  '/:assessmentId/reviews',
  validate(getAssessmentReviewsSchema, 'params'),
  validate(getAssessmentReviewsQuerySchema, 'query'),
  assessmentControllers.getAssessmentReviews,
);

export const assessmentsRoutes = router;
