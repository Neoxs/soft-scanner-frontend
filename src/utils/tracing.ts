import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ZipkinExporter } from '@opentelemetry/exporter-zipkin';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const setupTracing = () => {
  const provider = new WebTracerProvider({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'soft-scanner-frontend',
    }),
  });

  // Configure Zipkin exporter
  const zipkinExporter = new ZipkinExporter({
    url: 'http://localhost:9411/api/v2/spans',
  });

  provider.addSpanProcessor(new BatchSpanProcessor(zipkinExporter));

  // Register the provider
  provider.register({
    contextManager: new ZoneContextManager(),
  });

  // Register instrumentations
  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [
          /http:\/\/localhost:8080.*/, // Update this to match your backend URL
        ],
      }),
    ],
  });

  return provider.getTracer('soft-scanner-frontend');
};

export const tracer = setupTracing();