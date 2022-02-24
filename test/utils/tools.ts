import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { DatabaseModule } from '../../src/database/database.module';
import { DatabaseService } from '../../src/database/database.service';

interface TestSuite {
  app: INestApplication;
  close: () => Promise<void>;
}

export const initTestSuite = async (): Promise<TestSuite> => {
  const module = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const app = module.createNestApplication();

  // Don't load fixtures when testing
  const databaseService = app.select(DatabaseModule).get(DatabaseService);
  jest.spyOn(databaseService, 'loadFixtures').mockImplementation();

  await app.init();

  const close = async (): Promise<void> => {
    await app.close();
    jest.restoreAllMocks();
  };

  return { app, close };
};
