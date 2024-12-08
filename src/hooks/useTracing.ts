import { Context, Span, SpanKind, SpanStatusCode } from '@opentelemetry/api'
import { tracer } from '../../utils/tracing'

export const useTracing = () => {
  const startSpan = (
    name: string,
    options?: {
      kind?: SpanKind
      attributes?: Record<string, string | number | boolean>
      parent?: Context
    }
  ) => {
    return tracer.startSpan(name, {
      kind: options?.kind ?? SpanKind.CLIENT,
      attributes: options?.attributes,
    })
  }

  const endSpan = (span: Span, error?: Error) => {
    if (error) {
      span.setStatus({
        code: SpanStatusCode.ERROR,
        message: error.message,
      })
      span.recordException(error)
    } else {
      span.setStatus({ code: SpanStatusCode.OK })
    }
    span.end()
  }

  return { startSpan, endSpan }
}
