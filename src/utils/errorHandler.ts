import { AxiosError } from 'axios';

/**
 * Classe d'erreur personnalisée pour l'application
 */
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode?: number,
    public originalError?: unknown
  ) {
    super(message);
    this.name = 'AppError';
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * Codes d'erreur standardisés
 */
export enum ErrorCode {
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  TIMEOUT = 'TIMEOUT',
  CANCELED = 'CANCELED',
}

/**
 * Interface pour les erreurs API
 */
export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
  statusCode?: number;
}

/**
 * Convertit une erreur Axios en AppError
 */
export const handleApiError = (error: unknown): AppError => {
  // Erreur d'annulation (AbortController)
  if (error && typeof error === 'object' && 'name' in error) {
    if (error.name === 'CanceledError' || error.name === 'AbortError') {
      return new AppError(
        'Requête annulée',
        ErrorCode.CANCELED,
        0,
        error
      );
    }
  }

  // Erreur Axios
  if (error instanceof AxiosError) {
    const statusCode = error.response?.status;
    const errorData = error.response?.data as ApiErrorResponse | undefined;

    // Erreur réseau (pas de réponse du serveur)
    if (!error.response) {
      return new AppError(
        'Erreur de connexion au serveur. Vérifiez votre connexion internet.',
        ErrorCode.NETWORK_ERROR,
        undefined,
        error
      );
    }

    // Erreurs HTTP spécifiques
    switch (statusCode) {
      case 401:
        return new AppError(
          errorData?.message || 'Non autorisé. Veuillez vous connecter.',
          ErrorCode.UNAUTHORIZED,
          401,
          error
        );
      case 403:
        return new AppError(
          errorData?.message || 'Accès interdit.',
          ErrorCode.FORBIDDEN,
          403,
          error
        );
      case 404:
        return new AppError(
          errorData?.message || 'Ressource non trouvée.',
          ErrorCode.NOT_FOUND,
          404,
          error
        );
      case 400:
        return new AppError(
          errorData?.message || 'Données invalides.',
          ErrorCode.VALIDATION_ERROR,
          400,
          error
        );
      case 500:
      case 502:
      case 503:
        return new AppError(
          errorData?.message || 'Erreur serveur. Veuillez réessayer plus tard',
          ErrorCode.SERVER_ERROR,
          statusCode,
          error
        );
      default:
        return new AppError(
          errorData?.message || 'Une erreur est survenue',
          ErrorCode.UNKNOWN_ERROR,
          statusCode,
          error
        );
    }
  }

  // Erreur AppError déjà typée
  if (error instanceof AppError) {
    return error;
  }

  // Erreur générique
  if (error instanceof Error) {
    return new AppError(
      error.message || 'Une erreur inattendue est survenue.',
      ErrorCode.UNKNOWN_ERROR,
      undefined,
      error
    );
  }

  // Erreur inconnue
  return new AppError(
    'Une erreur inattendue est survenue.',
    ErrorCode.UNKNOWN_ERROR,
    undefined,
    error
  );
};

/**
 * Log une erreur de manière centralisée
 */
export const logError = (error: AppError, context?: string): void => {
  if (import.meta.env.DEV) {
    console.error(`[${context || 'Error'}]`, {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      originalError: error.originalError,
    });
  }
  // En production, vous pourriez envoyer l'erreur à un service de logging (Sentry, etc.)
};

/**
 * Affiche un message d'erreur utilisateur-friendly
 */
export const getErrorMessage = (error: AppError): string => {
  return error.message;
};
