import { test, expect } from '@playwright/test';
import { loginAs } from './fixtures/auth';

const TEST_USER = { email: 'test@doban.com', password: 'test123' };

test.describe('Cadastro de Pessoa — estrutura do formulario', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER, '/pessoas/novo');
    await expect(page).toHaveURL(/\/pessoas\/novo/);
  });

  test('deve exibir o titulo Cadastro de Pessoa', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /cadastro de pessoa/i })).toBeVisible();
  });

  test('deve exibir campos de dados pessoais basicos', async ({ page }) => {
    await expect(page.locator('[name="nome"]')).toBeVisible();
    await expect(page.locator('[name="email"]')).toBeVisible();
    await expect(page.locator('[name="telefone"]')).toBeVisible();
    await expect(page.locator('[name="dataNascimento"]')).toBeVisible();
    await expect(page.locator('[name="cpf"]')).toBeVisible();
  });

  test('deve exibir campos de endereco', async ({ page }) => {
    await expect(page.locator('[name="endereco"]')).toBeVisible();
    await expect(page.locator('[name="bairro"]')).toBeVisible();
    await expect(page.locator('[name="cidade"]')).toBeVisible();
    await expect(page.locator('[name="estado"]')).toBeVisible();
    await expect(page.locator('[name="cep"]')).toBeVisible();
  });

  test('deve exibir campos de documentos', async ({ page }) => {
    await expect(page.locator('[name="numeroRg"]')).toBeVisible();
    await expect(page.locator('[name="numeroCtps"]')).toBeVisible();
    await expect(page.locator('[name="pis"]')).toBeVisible();
  });

  test('deve exibir campos de CNH', async ({ page }) => {
    await expect(page.locator('[name="categoriaCnh"]')).toBeVisible();
    await expect(page.locator('[name="numeroCnh"]')).toBeVisible();
    await expect(page.locator('[name="validadeCnh"]')).toBeVisible();
  });

  test('deve exibir selects de tamanho EPI', async ({ page }) => {
    await expect(page.locator('select[name="tamanhoCamisa"]')).toBeVisible();
    await expect(page.locator('select[name="tamanhoCalca"]')).toBeVisible();
    await expect(page.locator('select[name="tamanhoCalcado"]')).toBeVisible();
    await expect(page.locator('select[name="tamanhoLuva"]')).toBeVisible();
    await expect(page.locator('select[name="tamanhoCapacete"]')).toBeVisible();
  });

  test('deve exibir botao Salvar e botao Limpar', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Salvar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Limpar' })).toBeVisible();
  });

  test('botao Limpar deve limpar os campos preenchidos', async ({ page }) => {
    await page.locator('[name="nome"]').fill('Teste Limpar');
    await page.locator('[name="email"]').fill('limpar@teste.com');
    await page.locator('[name="cidade"]').fill('Curitiba');

    await page.getByRole('button', { name: 'Limpar' }).click();

    await expect(page.locator('[name="nome"]')).toHaveValue('');
    await expect(page.locator('[name="email"]')).toHaveValue('');
    await expect(page.locator('[name="cidade"]')).toHaveValue('');
  });
});

test.describe('Cadastro de Pessoa — criar nova pessoa', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_USER, '/pessoas/novo');
  });

  test('deve enviar requisicao POST com os dados preenchidos', async ({ page }) => {
    const timestamp = Date.now();
    const nome = `Pessoa E2E ${timestamp}`;
    const email = `e2e${timestamp}@teste.com`;

    const requestPromise = page.waitForRequest(req =>
      req.url().includes('/api/v1/pessoas') && req.method() === 'POST'
    );

    await page.locator('[name="nome"]').fill(nome);
    await page.locator('[name="email"]').fill(email);
    await page.locator('[name="cidade"]').fill('Curitiba');
    await page.locator('[name="estado"]').fill('PR');
    await page.locator('select[name="estadoCivil"]').selectOption('Solteiro(a)');
    await page.locator('select[name="tamanhoCamisa"]').selectOption('M');

    await page.getByRole('button', { name: 'Salvar' }).click();

    const request = await requestPromise;
    const body = request.postDataJSON();

    expect(body.nome).toBe(nome);
    expect(body.email).toBe(email);
    expect(body.cidade).toBe('Curitiba');
    expect(body.estado).toBe('PR');
    expect(body.estadoCivil).toBe('Solteiro(a)');
    expect(body.tamanhoCamisa).toBe('M');
  });

  test('deve navegar para detalhes apos criar com sucesso', async ({ page }) => {
    const timestamp = Date.now();
    await page.locator('[name="nome"]').fill(`Pessoa E2E ${timestamp}`);
    await page.locator('[name="email"]').fill(`e2e${timestamp}@teste.com`);

    await page.getByRole('button', { name: 'Salvar' }).click();

    await expect(page).toHaveURL(/\/pessoas\/\d+\/detalhes/, { timeout: 10000 });
  });

  test('deve converter campos vazios para null no payload enviado', async ({ page }) => {
    const requestPromise = page.waitForRequest(req =>
      req.url().includes('/api/v1/pessoas') && req.method() === 'POST'
    );

    await page.locator('[name="nome"]').fill(`Pessoa Null Test ${Date.now()}`);
    // Todos os outros campos permanecem vazios
    await page.getByRole('button', { name: 'Salvar' }).click();

    const request = await requestPromise;
    const body = request.postDataJSON();

    // O componente converte strings vazias em null via emptyStringsToNull()
    expect(body.email).toBeNull();
    expect(body.cidade).toBeNull();
    expect(body.cpf).toBeNull();
  });
});

test.describe('Cadastro de Pessoa — editar pessoa existente', () => {
  async function navegarParaEdicao(page: import('@playwright/test').Page): Promise<string | null> {
    await loginAs(page, TEST_USER, '/pessoas/lista');
    await page.locator('.pessoa-card-skeleton').waitFor({ state: 'detached' }).catch(() => {});

    const cards = page.locator('.pessoa-card.ativa');
    if (await cards.count() === 0) return null;

    await cards.first().click();
    await expect(page).toHaveURL(/\/pessoas\/(\d+)\/detalhes/);

    const pessoaId = page.url().match(/\/pessoas\/(\d+)\/detalhes/)?.[1] ?? null;
    if (pessoaId) {
      await page.goto(`http://localhost:4200/pessoas/${pessoaId}/editar`);
    }
    return pessoaId;
  }

  test('deve exibir titulo Atualizar Pessoa e ocultar botao Limpar', async ({ page }) => {
    const pessoaId = await navegarParaEdicao(page);
    if (!pessoaId) { test.skip(); return; }

    await expect(page.getByRole('heading', { name: /atualizar pessoa/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Atualizar' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Limpar' })).not.toBeVisible();
  });

  test('deve pre-preencher campo nome com dados existentes', async ({ page }) => {
    const pessoaId = await navegarParaEdicao(page);
    if (!pessoaId) { test.skip(); return; }

    const nomeValue = await page.locator('[name="nome"]').inputValue();
    expect(nomeValue.trim().length).toBeGreaterThan(0);
  });

  test('deve enviar requisicao PUT com dados atualizados', async ({ page }) => {
    const pessoaId = await navegarParaEdicao(page);
    if (!pessoaId) { test.skip(); return; }

    const requestPromise = page.waitForRequest(req =>
      req.url().includes(`/api/v1/pessoas/${pessoaId}`) && req.method() === 'PUT'
    );

    await page.locator('[name="cidade"]').fill('Londrina');
    await page.locator('[name="estado"]').fill('PR');
    await page.getByRole('button', { name: 'Atualizar' }).click();

    const request = await requestPromise;
    const body = request.postDataJSON();

    expect(body.cidade).toBe('Londrina');
    expect(body.estado).toBe('PR');

    await expect(page).toHaveURL(/\/pessoas\/\d+\/detalhes/, { timeout: 10000 });
  });
});
