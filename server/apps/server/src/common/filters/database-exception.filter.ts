import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const errorObj = exception as Record<string, unknown> | null | undefined;
    const isPgError =
      errorObj &&
      typeof errorObj.code === 'string' &&
      /^[0-9A-Z]{5}$/.test(errorObj.code) &&
      ('constraint' in errorObj || 'table' in errorObj || 'detail' in errorObj);

    if (isPgError && errorObj) {
      const code = errorObj.code as string;
      const constraint = (errorObj.constraint as string) || '';
      let status = HttpStatus.INTERNAL_SERVER_ERROR;
      let message = 'Có lỗi xảy ra khi truy xuất cơ sở dữ liệu.';

      if (code === '23505') {
        // Unique violation
        status = HttpStatus.CONFLICT;
        message = 'Dữ liệu này đã tồn tại trong hệ thống.';

        if (constraint.includes('unique_student_semester_subject')) {
          message = 'Môn học này đã được nhập điểm cho học kỳ này!';
        } else if (constraint.includes('unique_oauth_provider')) {
          message =
            'Tài khoản mạng xã hội này đã được liên kết với một người dùng khác!';
        } else if (constraint.includes('unique_admission_record')) {
          message =
            'Thông tin điểm chuẩn này đã tồn tại cho tổ hợp và năm học này!';
        } else if (constraint.includes('unique_note_edge')) {
          message = 'Liên kết giữa hai ghi chú này đã tồn tại!';
        } else if (constraint.includes('email')) {
          message = 'Địa chỉ email này đã được sử dụng!';
        }
      } else if (code === '23503') {
        // Foreign key violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Dữ liệu tham chiếu không tồn tại hoặc không hợp lệ.';
      } else if (code === '23502') {
        // Not null violation
        status = HttpStatus.BAD_REQUEST;
        message = 'Không được để trống các trường dữ liệu bắt buộc.';
      }

      return response.status(status).json({
        statusCode: status,
        message,
        error: 'Database Error',
        timestamp: new Date().toISOString(),
      });
    }

    throw exception;
  }
}
