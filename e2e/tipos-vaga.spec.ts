import { test, expect } from '@playwright/test';
import { loginAs } from './fixtures/auth';

const TEST_USER = { email: 'test@doban.com', password: 'test123' };

test.describe('Gestao de Tipos de Vaga', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER, '/tipos-vaga');
  });

  test('deve exibir a pagina de tipos de vaga', async ({ page }) => {
    await expect(page).toHaveURL(/\/tipos-vaga/);
  });

  test('deve exibir link ou botao para novo tipo de vaga', async ({ page }) => {
    const newButton = page.getByRole('link', { name: /novo/i })
      .or(page.getByRole('button', { name: /novo/i }));
    await expect(newButton.first()).toBeVisible();
  });
});

test.describe('Formulario de Tipo de Vaga', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER, '/tipos-vaga/novo');
  });

  test('deve exibir o formulario de novo tipo de vaga', async ({ page }) => {
    await expect(page).toHaveURL(/\/tipos-vaga\/novo/);
  });

  test('deve validar campo codigo — aceita apenas letras maiusculas', async ({ page }) => {
    const codigoInput = page.locator('[formcontrolname="codigo"]');
    await codigoInput.fill('adm');
    await page.locator('[formcontrolname="nome"]').click(); // trigger blur
    // Field should be invalid — check for an error class or message
    const isInvalid = await codigoInput.evaluate(el => el.classList.contains('ng-invalid'));
    expect(isInvalid).toBeTruthy();
  });

  test('deve aceitar codigo em letras maiusculas valido', async ({ page }) => {
    const codigoInput = page.locator('[formcontrolname="codigo"]');
    await codigoInput.fill('ADM');
    await page.locator('[formcontrolname="nome"]').click();
    const isInvalid = await codigoInput.evaluate(el => el.classList.contains('ng-invalid'));
    expect(isInvalid).toBeFalsy();
  });

  test('deve adicionar e remover item padrao', async ({ page }) => {
    const addButton = page.getByRole('button', { name: /adicionar item/i });
    await addButton.click();

    // Each item is rendered inside a .item-card container
    const itemCards = page.locator('.item-card');
    await expect(itemCards).toHaveCount(1);

    const removeButton = page.getByRole('button', { name: /remover/i }).first();
    await removeButton.click();

    await expect(itemCards).toHaveCount(0);
  });
});
