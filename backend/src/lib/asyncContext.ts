import { AsyncLocalStorage } from 'async_hooks';

interface RequestContext {
  requestId: string;
  [key: string]: unknown;
}

class AsyncContextManager {
  private asyncLocalStorage: AsyncLocalStorage<RequestContext>;

  constructor() {
    this.asyncLocalStorage = new AsyncLocalStorage<RequestContext>();
  }

  run<T>(context: RequestContext, callback: () => T): T {
    return this.asyncLocalStorage.run(context, callback);
  }

  getContext(): RequestContext | undefined {
    return this.asyncLocalStorage.getStore();
  }

  getRequestId(): string | undefined {
    const context = this.getContext();
    return context?.requestId;
  }

  set(key: string, value: unknown): void {
    const context = this.getContext();
    if (context) {
      context[key] = value;
    }
  }

  get(key: string): unknown {
    const context = this.getContext();
    return context?.[key];
  }
}

export const asyncContext = new AsyncContextManager();
