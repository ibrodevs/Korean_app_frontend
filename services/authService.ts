import { LoginFormData, RegisterFormData, AuthResponse } from '../types/auth';

// Моковые данные для демо
const mockUsers = [
  {
    id: '1',
    email: 'user@example.com',
    password: 'password123',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
  },
];

export const authService = {
  // Имитация задержки сети
  delay: (ms: number) => new Promise(resolve => setTimeout(resolve, ms)),

  // Вход
  login: async (data: LoginFormData): Promise<AuthResponse> => {
    await authService.delay(1000); // Имитация сетевого запроса

    const user = mockUsers.find(
      u => u.email === data.email && u.password === data.password
    );

    if (!user) {
      return {
        success: false,
        error: 'auth.errors.invalidCredentials',
      };
    }

    return {
      success: true,
      token: 'mock-jwt-token-123456',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    };
  },

  // Регистрация
  register: async (data: RegisterFormData): Promise<AuthResponse> => {
    await authService.delay(1000); // Имитация сетевого запроса

    const emailExists = mockUsers.some(u => u.email === data.email);
    
    if (emailExists) {
      return {
        success: false,
        error: 'auth.errors.emailExists',
      };
    }

    const newUser = {
      id: String(mockUsers.length + 1),
      email: data.email,
      password: data.password,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
    };

    mockUsers.push(newUser);

    return {
      success: true,
      token: 'mock-jwt-token-789012',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    };
  },

  // Восстановление пароля
  forgotPassword: async (email: string): Promise<{ success: boolean; message: string }> => {
    await authService.delay(800);
    
    const userExists = mockUsers.some(u => u.email === email);
    
    if (!userExists) {
      return {
        success: false,
        message: 'Email not found',
      };
    }

    return {
      success: true,
      message: 'Password reset instructions sent to your email',
    };
  },
};