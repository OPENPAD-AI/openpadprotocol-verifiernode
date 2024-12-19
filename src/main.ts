import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'], // Enable all log levels
  });
  app.enableShutdownHooks();
  process.on('SIGTERM', async () => {
    console.log('Received SIGTERM. Gracefully shutting down...');
    await app.close();
    process.exit(0); // Ensure that the process exits after shutdown
  });

  process.on('SIGINT', async () => {
    console.log('Received SIGINT. Gracefully shutting down...');
    await app.close();
    process.exit(0); // Ensure that the process exits after shutdown
  });
  await app.listen(process.env.PORT ?? 5000);
}
bootstrap();
