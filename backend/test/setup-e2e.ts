import { existsSync } from 'node:fs';

/**
 * Prepara el entorno de los tests e2e:
 * - carga backend/.env (si existe);
 * - usa TEST_MONGODB_URI como MONGODB_URI, para no tocar nunca la base de datos de la demo.
 */
if (existsSync('.env')) process.loadEnvFile('.env');

const testUri = process.env.TEST_MONGODB_URI;
if (testUri) {
  const dbName = new URL(
    testUri.replace(/^mongodb(\+srv)?:/, 'http:'),
  ).pathname.slice(1);
  if (!dbName.includes('test')) {
    throw new Error(
      `TEST_MONGODB_URI ha d'apuntar a una base de dades de proves (el nom ha de contenir «test»). Ara: «${dbName}»`,
    );
  }
  if (testUri === process.env.MONGODB_URI) {
    throw new Error('TEST_MONGODB_URI no pot ser igual que MONGODB_URI');
  }
  process.env.MONGODB_URI = testUri;
}
process.env.DEMO_TODAY = '2026-11-04';
process.env.DEMO_MODE = 'true';
