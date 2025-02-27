import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { createErrorResponse } from 'src/helpers/apiResponse.helper';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception?.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    let message = exception.message;

    // ValidationPipe 에러인 경우, 상세 메시지 포맷 변경
    if (exception.getResponse && typeof exception.getResponse === 'function') {
      const res = exception.getResponse();
      if (typeof res === 'object' && res['message']) {
        message = Array.isArray(res['message']) ? res['message'].join(', ') : res['message'];
      }
    }

    const error = {
      message,
      getStatus: () => status,
    };

    const errorResponse = createErrorResponse(error);

    response.status(status).json(errorResponse);
  }
}
