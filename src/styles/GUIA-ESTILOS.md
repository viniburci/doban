# Guia de Estilos Globais do Projeto

Este guia documenta os estilos globais disponíveis no projeto e como utilizá-los para manter consistência visual.

## Variáveis CSS

Todas as variáveis CSS estão definidas em `src/styles.css` e podem ser utilizadas em qualquer componente.

### Cores

```css
/* Cores Primárias */
--primary-gradient-start: #667eea;
--primary-gradient-end: #764ba2;
--primary-color: #667eea;

/* Cores Secundárias */
--danger-gradient-start: #dc3545;
--danger-gradient-end: #c82333;
--success-gradient-start: #28a745;
--success-gradient-end: #218838;

/* Cores de Texto */
--text-primary: #212529;
--text-secondary: #6c757d;
--text-muted: #adb5bd;

/* Cores de Borda */
--border-color: #e9ecef;
--border-color-light: #e0e7ff;
--border-color-focus: #667eea;

/* Cores de Fundo */
--bg-white: #ffffff;
--bg-light: #f8f9fa;
--bg-disabled: #f8f9fa;
```

### Sombras

```css
--shadow-sm: 0 4px 12px rgba(0, 0, 0, 0.1);
--shadow-md: 0 10px 40px rgba(0, 0, 0, 0.12);
--shadow-lg: 0 15px 50px rgba(0, 0, 0, 0.15);
--shadow-primary: 0 4px 12px rgba(102, 126, 234, 0.25);
--shadow-primary-hover: 0 8px 20px rgba(102, 126, 234, 0.35);
```

### Raios de Borda

```css
--radius-sm: 0.5rem;    /* 8px */
--radius-md: 0.75rem;   /* 12px */
--radius-lg: 1rem;      /* 16px */
--radius-xl: 1.25rem;   /* 20px */
```

### Espaçamentos

```css
--spacing-xs: 0.25rem;  /* 4px */
--spacing-sm: 0.5rem;   /* 8px */
--spacing-md: 1rem;     /* 16px */
--spacing-lg: 1.5rem;   /* 24px */
--spacing-xl: 2rem;     /* 32px */
```

### Transições

```css
--transition-fast: 0.15s ease;
--transition-base: 0.3s ease;
--transition-smooth: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

## Classes Globais

### Cards

```html
<!-- Card básico com hover -->
<div class="card">
  <div class="card-header">
    <h4>Título do Card</h4>
    <small>Subtítulo</small>
  </div>
  <div class="card-body">
    Conteúdo do card
  </div>
</div>
```

### Formulários

#### Labels e Inputs

```html
<div class="col-md-6">
  <label class="form-label" for="campo">Nome do Campo</label>
  <input id="campo" type="text" class="form-control" placeholder="Digite aqui">
</div>
```

#### Select

```html
<div class="col-md-6">
  <label class="form-label" for="select">Selecione uma Opção</label>
  <select id="select" class="form-select">
    <option value="">Selecione...</option>
    <option value="1">Opção 1</option>
  </select>
</div>
```

#### Radio Buttons

```html
<div class="form-check">
  <input class="form-check-input" type="radio" id="opcao1" name="opcoes" value="1">
  <label class="form-check-label" for="opcao1">
    Opção 1
  </label>
</div>
```

#### Floating Labels

```html
<div class="form-floating">
  <select class="form-select" id="floatingSelect">
    <option value="">Selecione...</option>
  </select>
  <label for="floatingSelect">Nome do Campo</label>
</div>
```

### Botões

```html
<!-- Botão Primário -->
<button class="btn btn-primary">
  Salvar
</button>

<!-- Botão Danger -->
<button class="btn btn-danger">
  Cancelar
</button>

<!-- Botão Success -->
<button class="btn btn-success">
  Confirmar
</button>

<!-- Botões com gap -->
<div class="d-flex gap-2">
  <button class="btn btn-danger">Fechar</button>
  <button class="btn btn-primary">Salvar</button>
</div>
```

### Alertas

```html
<!-- Alerta de Erro -->
<div class="alert alert-danger">
  Mensagem de erro
</div>

<!-- Alerta de Sucesso -->
<div class="alert alert-success">
  Operação realizada com sucesso
</div>

<!-- Alerta de Warning -->
<div class="alert alert-warning">
  Atenção: verifique os dados
</div>

<!-- Alerta de Info -->
<div class="alert alert-info">
  Informação importante
</div>
```

### Seções de Formulário

```html
<div class="col-12 mt-4">
  <h5 class="section-title">Informações do Contrato</h5>
</div>
```

Ou usando a classe text-muted (mais sutil):

```html
<div class="col-12 mt-4">
  <h5 class="text-muted mb-3 fw-semibold">Informações do Contrato</h5>
</div>
```

### Estados Vazios

```html
<div class="empty-state">
  <div class="empty-state-icon"></div>
  <p class="empty-state-text">Nenhum registro encontrado</p>
</div>
```

### Animações

```html
<!-- Fade In -->
<div class="fade-in">
  Conteúdo com animação fade-in
</div>

<!-- Slide Down -->
<div class="slide-down">
  Conteúdo com animação slide-down
</div>
```

## Template Base de Formulário

```html
<div class="container mb-5">
  <div class="row justify-content-center">
    <div class="col-lg-10">
      <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
          <h4 class="mb-0">Título do Formulário</h4>
          <small class="text-white-50">Descrição do formulário</small>
        </div>
        <div class="card-body">
          <form [formGroup]="form" (submit)="onSubmit()" novalidate>
            <div class="row g-3">

              <!-- Seção 1 -->
              <div class="col-12">
                <h5 class="text-muted mb-3 fw-semibold">Seção 1</h5>
              </div>

              <div class="col-md-6">
                <label class="form-label" for="campo1">Campo 1</label>
                <input id="campo1" type="text" class="form-control"
                  placeholder="Digite aqui" formControlName="campo1">
              </div>

              <!-- Mais campos... -->

            </div>

            <div class="col-12 mt-4 d-flex justify-content-end gap-2">
              <button type="button" (click)="onClose()" class="btn btn-danger">
                Fechar
              </button>
              <button type="submit" class="btn btn-primary">
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</div>
```

## CSS Customizado em Componentes

Se precisar customizar estilos em um componente específico, use as variáveis:

```css
/* component.css */
.meu-elemento {
  background: linear-gradient(
    135deg,
    var(--primary-gradient-start) 0%,
    var(--primary-gradient-end) 100%
  );
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
  transition: all var(--transition-smooth);
}

.meu-elemento:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}
```

## Boas Práticas

1. **Sempre use variáveis CSS** ao invés de valores hardcoded
2. **Mantenha consistência** usando as classes globais quando possível
3. **Evite criar estilos duplicados** - verifique se já existe uma classe global
4. **Use transições suaves** para melhor UX (var(--transition-smooth))
5. **Adicione hover states** em elementos interativos
6. **Use sombras para profundidade** visual
7. **Mantenha acessibilidade** com IDs únicos e labels
8. **Organize formulários em seções** lógicas
9. **Use placeholders descritivos** em todos os campos
10. **Teste responsividade** - os estilos globais já incluem media queries

## Exemplos de Uso

### Botão com Gradiente Customizado

```css
.btn-custom {
  background: linear-gradient(
    135deg,
    var(--primary-gradient-start) 0%,
    var(--primary-gradient-end) 100%
  );
  color: white;
  box-shadow: var(--shadow-primary);
  border-radius: var(--radius-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  transition: all var(--transition-smooth);
}

.btn-custom:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-primary-hover);
}
```

### Card com Estilo Customizado

```css
.card-custom {
  border: 2px solid var(--border-color-light);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-lg);
  background-color: var(--bg-white);
}
```

### Input com Validação

```css
.form-control.is-invalid {
  border-color: var(--danger-gradient-start);
}

.form-control.is-valid {
  border-color: var(--success-gradient-start);
}
```

## Suporte

Para dúvidas ou sugestões sobre os estilos globais, consulte o arquivo `src/styles.css` ou entre em contato com a equipe de desenvolvimento.
