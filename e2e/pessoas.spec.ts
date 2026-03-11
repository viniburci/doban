import { test, expect } from '@playwright/test';
import { loginAs } from './fixtures/auth';

// Update these credentials to match a test user in your backend
const TEST_USER = { email: 'test@doban.com', password: 'test123' };

test.describe('Lista de Pessoas', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER, '/pessoas/lista');
  });

  test('deve exibir a pagina de lista de pessoas', async ({ page }) => {
    await expect(page).toHaveURL(/\/pessoas\/lista/);
    await expect(page.getByRole('heading', { name: /pessoas/i })).toBeVisible();
  });

  test('deve exibir as colunas Ativas e Inativas', async ({ page }) => {
    await expect(page.getByText('Ativas', { exact: true })).toBeVisible();
    await expect(page.getByText('Inativas', { exact: true })).toBeVisible();
  });

  test('deve exibir botao Registrar Pessoa', async ({ page }) => {
    await expect(page.getByRole('button', { name: /registrar pessoa/i })).toBeVisible();
  });

  test('deve navegar para cadastro ao clicar em Registrar Pessoa', async ({ page }) => {
    await page.getByRole('button', { name: /registrar pessoa/i }).click();
    await expect(page).toHaveURL(/\/pessoas\/novo/);
  });

  test('deve exibir estado vazio ou cards quando nao ha pessoas ativas', async ({ page }) => {
    // Wait for skeleton loading to finish
    await page.locator('.pessoa-card-skeleton').waitFor({ state: 'detached' }).catch(() => {});

    const hasCards = await page.locator('.pessoa-card.ativa').count();
    const hasEmptyState = await page.locator('.empty-state-text').first().isVisible();
    expect(hasCards > 0 || hasEmptyState).toBeTruthy();
  });

  test('deve navegar para detalhes ao clicar em um card de pessoa', async ({ page }) => {
    const cards = page.locator('.pessoa-card.ativa');
    const count = await cards.count();
    if (count === 0) {
      test.skip();
      return;
    }
    await cards.first().click();
    await expect(page).toHaveURL(/\/pessoas\/\d+\/detalhes/);
  });
});
