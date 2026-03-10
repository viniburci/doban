import { Page, request } from '@playwright/test';

const AUTH_URL = 'http://localhost:8080/api/v1/auth/login';
const FRONTEND_URL = 'http://localhost:4200';

export interface TestCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/**
 * Calls the test auth endpoint to obtain JWT tokens.
 */
export async function fetchTokens(credentials: TestCredentials): Promise<AuthTokens> {
  const ctx = await request.newContext();
  const response = await ctx.post(AUTH_URL, { data: credentials });

  if (!response.ok()) {
    throw new Error(`Auth endpoint returned ${response.status()}: ${await response.text()}`);
  }

  const body = await response.json() as AuthTokens;
  await ctx.dispose();
  return body;
}

/**
 * Injects auth tokens into localStorage and navigates to the given path.
 * The page must already be on the same origin (localhost:4200).
 */
export async function loginAs(page: Page, credentials: TestCredentials, path = '/pessoas/lista'): Promise<void> {
  const tokens = await fetchTokens(credentials);

  // Navigate to the app first so localStorage is available for the correct origin
  await page.goto(FRONTEND_URL);

  await page.evaluate(({ accessToken, refreshToken }) => {
    localStorage.setItem('auth_token', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }, tokens);

  await page.goto(`${FRONTEND_URL}${path}`);
}
