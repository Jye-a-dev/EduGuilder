import { Pool } from 'pg';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

export const PG_CONNECTION = 'PG_CONNECTION';

export const pgProvider = {
  provide: PG_CONNECTION,
  useFactory: (configService: ConfigService) => {
    const logger = new Logger('DatabaseConnection');
    const pool = new Pool({
      host: configService.get<string>('database.host'),
      port: configService.get<number>('database.port'),
      user: configService.get<string>('database.username'),
      password: configService.get<string>('database.password'),
      database: configService.get<string>('database.database'),
    });

    // Run connection test in the background so it does not block application startup
    pool.connect()
      .then((client) => {
        const dbName = configService.get<string>('database.database');
        const host = configService.get<string>('database.host');
        const port = configService.get<number>('database.port');
        logger.log(
          `Successfully connected to database "${dbName}" at ${host}:${port}`,
        );
        client.release();
      })
      .catch((error) => {
        const errMsg = error instanceof Error ? error.message : String(error);
        logger.error(`Failed to connect to database: ${errMsg}`);
      });

    return pool;
  },
  inject: [ConfigService],
};
