import { HttpException } from '@nestjs/common';

// 성공 응답 타입
export interface ApiResponseSuccess<T> {
  success: boolean;
  data: T;
  error: null;
}

// 실패 응답 타입
export interface ApiResponseFailure {
  success: boolean;
  data: null;
  error: {
    message: string;
    code?: number;
  };
}
// type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseFailure;

type PickedHttpException = Pick<HttpException, 'message' | 'getStatus'>;

// NOTE: 성공 읍답 생성 함수
export const createSuccessResponse = <T>(data: T): ApiResponseSuccess<T> => ({
  success: true,
  data,
  error: null,
});

// 실패 응답 생성 함수
export const createErrorResponse = (error: PickedHttpException): ApiResponseFailure => ({
  success: false,
  data: null,
  error: {
    message: error.message,
    code: error?.getStatus(),
  },
});
