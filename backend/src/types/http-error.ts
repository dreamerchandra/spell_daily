export class HttpError extends Error {
  code: number;
  type: string;
  extra: unknown;
  constructor(
    message: string,
    code?: number,
    {
      extra,
    }: {
      extra?: unknown;
    } = {}
  ) {
    super(message);
    this.type = 'HttpException';
    this.code = code || 400;
    this.message = message;
    this.extra = extra;
  }
}

export class UnauthorizedError extends HttpError {
  constructor() {
    super('Login to continue', 401);
  }
}
