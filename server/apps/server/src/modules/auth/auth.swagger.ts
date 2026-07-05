import { applyDecorators } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

export const ApiAuth = {
  controller: () => applyDecorators(ApiTags('Authentication')),

  register: () =>
    applyDecorators(
      ApiOperation({ summary: 'Register a new user account' }),
      ApiResponse({ status: 201, description: 'User successfully registered' }),
      ApiResponse({
        status: 400,
        description: 'Bad request or validation error',
      }),
      ApiResponse({ status: 409, description: 'Email already exists' }),
    ),

  login: () =>
    applyDecorators(
      ApiOperation({ summary: 'Authenticate user and return tokens' }),
      ApiResponse({ status: 200, description: 'Successfully logged in' }),
      ApiResponse({ status: 401, description: 'Invalid email or password' }),
    ),

  logout: () =>
    applyDecorators(
      ApiBearerAuth(),
      ApiOperation({
        summary: 'Revoke the current user session/refresh token',
      }),
      ApiResponse({ status: 200, description: 'Successfully logged out' }),
      ApiResponse({ status: 401, description: 'Unauthorized' }),
    ),

  forgotPassword: () =>
    applyDecorators(
      ApiOperation({
        summary:
          'Request password reset token (returns token in payload for testing)',
      }),
      ApiResponse({
        status: 200,
        description: 'Reset token successfully generated',
      }),
      ApiResponse({ status: 404, description: 'Email not found' }),
    ),

  resetPassword: () =>
    applyDecorators(
      ApiOperation({ summary: 'Reset password using valid reset token' }),
      ApiResponse({ status: 200, description: 'Password successfully reset' }),
      ApiResponse({ status: 400, description: 'Invalid or expired token' }),
    ),
};
