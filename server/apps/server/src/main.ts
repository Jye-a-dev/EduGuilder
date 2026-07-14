import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger/swagger.config';
import { DatabaseExceptionFilter } from './common/filters/database-exception.filter';

interface RouteLayer {
  route?: {
    path: string;
    methods: Record<string, boolean>;
  };
}

interface ExpressAppInstance {
  router?: {
    stack?: RouteLayer[];
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const logger = new Logger('Bootstrap');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('app.port') || 3000;

  // Set up Swagger UI
  setupSwagger(app);

  // Enable global validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Enable database exceptions filter
  app.useGlobalFilters(new DatabaseExceptionFilter());

  await app.listen(port);

  logger.log(`Server is running at: http://localhost:${port}`);
  logger.log(`Swagger documentation: http://localhost:${port}/api-docs`);

  // Extract and print all registered routes
  const expressApp = app.getHttpAdapter().getInstance() as ExpressAppInstance;
  const router = expressApp?.router;
  if (router?.stack) {
    const routes = router.stack
      .filter(
        (
          layer,
        ): layer is RouteLayer & { route: NonNullable<RouteLayer['route']> } =>
          !!layer.route && !layer.route.path.startsWith('/api-docs'),
      )
      .map((layer) => {
        const methods = Object.keys(layer.route.methods)
          .map((m) => m.toUpperCase())
          .join(', ');
        return `[${methods}] ${layer.route.path}`;
      });
    if (routes.length > 0) {
      logger.log(
        `Registered Routes:\n${routes.map((r) => `  -> ${r}`).join('\n')}`,
      );
    }
  }
}
bootstrap().catch((err: unknown) => {
  const logger = new Logger('Bootstrap');
  logger.error(err);
  process.exit(1);
});
