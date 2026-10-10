import { Response } from 'express';

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export class ResponseView {
  static success<T>(res: Response, data: T, message = 'Thao tác thành công', statusCode = 200) {
    const payload: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static error(res: Response, message: string, error?: string, statusCode = 400) {
    const payload: ApiResponse = {
      success: false,
      message,
      error: error || message,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(payload);
  }

  static created<T>(res: Response, data: T, message = 'Đã tạo thành công') {
    return this.success(res, data, message, 201);
  }

  static notFound(res: Response, message = 'Không tìm thấy dữ liệu') {
    return this.error(res, message, 'NOT_FOUND', 404);
  }

  static unauthorized(res: Response, message = 'Không có quyền truy cập') {
    return this.error(res, message, 'UNAUTHORIZED', 401);
  }
}
