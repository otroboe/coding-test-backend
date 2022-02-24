import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';
import { DatabaseModule } from '../../src/database/database.module';
import { FixturesService } from '../../src/database/fixtures.service';

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
  const fixtures = app.select(DatabaseModule).get(FixturesService);
  jest.spyOn(fixtures, 'load').mockImplementation();

  await app.init();

  const close = async (): Promise<void> => {
    await app.close();
    jest.restoreAllMocks();
  };

  return { app, close };
};
