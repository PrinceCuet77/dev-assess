import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { assessmentServices } from './assessments.services';
import {
  IGetAllAssessmentsQuery,
  IGetAssessmentReviewsQuery,
} from './assessments.interfaces';

const getAllAssessments = catchAsync(async (req: Request, res: Response) => {
  const { assessments, meta } = await assessmentServices.getAllAssessments(
    req.query as unknown as IGetAllAssessmentsQuery,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Assessments is retrieved successfully',
    data: assessments,
    meta,
  });
});

const getAssessmentById = catchAsync(async (req: Request, res: Response) => {
  const assessment = await assessmentServices.getAssessmentById(
    req.params.assessmentId as string,
  );

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Assessment is retrieved successfully',
    data: assessment,
  });
});

const getAssessmentReviews = catchAsync(
  async (req: Request, res: Response) => {
    const { reviews, meta } = await assessmentServices.getAssessmentReviews(
      req.params.assessmentId as string,
      req.query as unknown as IGetAssessmentReviewsQuery,
    );

    sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
      message: 'Assessment reviews is retrieved successfully',
      data: reviews,
      meta,
    });
  },
);

export const assessmentControllers = {
  getAllAssessments,
  getAssessmentById,
  getAssessmentReviews,
};
