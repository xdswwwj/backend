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
    details?: any;
  };
}
// type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseFailure;

// NOTE: 성공 읍답 생성 함수
export const createSuccessResponse = <T>(data: T): ApiResponseSuccess<T> => ({
  success: true,
  data,
  error: null,
});

// 실패 응답 생성 함수
export const createErrorResponse = ({
  message,
  code,
  details,
}: {
  message: string;
  code?: number;
  details?: any;
}): ApiResponseFailure => ({
  success: false,
  data: null,
  error: { message, code, details },
});
