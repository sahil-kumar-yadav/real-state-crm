// lib/api-response.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  statusCode: number;
}

export const successResponse = <T>(
  data: T,
  message: string = "Success",
  statusCode: number = 200
): ApiResponse<T> => ({
  success: true,
  data,
  message,
  statusCode,
});

export const errorResponse = (
  error: string,
  statusCode: number = 400
): ApiResponse => ({
  success: false,
  error,
  statusCode,
});

export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
  message: string = "Success"
) => ({
  success: true,
  data,
  pagination: {
    total,
    page,
    limit,
    pages: Math.ceil(total / limit),
  },
  message,
  statusCode: 200,
});
