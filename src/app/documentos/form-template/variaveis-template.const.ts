export interface VariavelTemplate {
  nome: string;
  rotulo: string;
  thymeleaf: string;
}

export interface CategoriaVariaveis {
  categoria: string;
  icone: string;
  variaveis: VariavelTemplate[];
}

export const VARIAVEIS_TEMPLATE: CategoriaVariaveis[] = [
  {
    categoria: 'Pessoa',
    icone: 'bi-person',
    variaveis: [
      { nome: 'pessoa.nome', rotulo: 'Nome', thymeleaf: '${pessoa.nome}' },
      { nome: 'pessoa.email', rotulo: 'Email', thymeleaf: '${pessoa.email}' },
      { nome: 'pessoa.telefone', rotulo: 'Telefone', thymeleaf: '${pessoa.telefone}' },
      { nome: 'pessoa.cpf', rotulo: 'CPF', thymeleaf: '${pessoa.cpf}' },
      { nome: 'pessoa.numeroRg', rotulo: 'RG', thymeleaf: '${pessoa.numeroRg}' },
      { nome: 'pessoa.dataEmissaoRg', rotulo: 'Data Emissao RG', thymeleaf: '${pessoa.dataEmissaoRg}' },
      { nome: 'pessoa.ufRg', rotulo: 'UF RG', thymeleaf: '${pessoa.ufRg}' },
      { nome: 'pessoa.pis', rotulo: 'PIS', thymeleaf: '${pessoa.pis}' },
      { nome: 'pessoa.tituloEleitor', rotulo: 'Titulo Eleitor', thymeleaf: '${pessoa.tituloEleitor}' },
      { nome: 'pessoa.dataNascimento', rotulo: 'Data Nascimento', thymeleaf: '${pessoa.dataNascimento}' },
      { nome: 'pessoa.localNascimento', rotulo: 'Local Nascimento', thymeleaf: '${pessoa.localNascimento}' },
      { nome: 'pessoa.estadoCivil', rotulo: 'Estado Civil', thymeleaf: '${pessoa.estadoCivil}' },
      { nome: 'pessoa.mae', rotulo: 'Mae', thymeleaf: '${pessoa.mae}' },
      { nome: 'pessoa.pai', rotulo: 'Pai', thymeleaf: '${pessoa.pai}' },
      { nome: 'pessoa.endereco', rotulo: 'Endereco', thymeleaf: '${pessoa.endereco}' },
      { nome: 'pessoa.complemento', rotulo: 'Complemento', thymeleaf: '${pessoa.complemento}' },
      { nome: 'pessoa.bairro', rotulo: 'Bairro', thymeleaf: '${pessoa.bairro}' },
      { nome: 'pessoa.cidade', rotulo: 'Cidade', thymeleaf: '${pessoa.cidade}' },
      { nome: 'pessoa.estado', rotulo: 'Estado', thymeleaf: '${pessoa.estado}' },
      { nome: 'pessoa.cep', rotulo: 'CEP', thymeleaf: '${pessoa.cep}' },
      { nome: 'pessoa.numeroCtps', rotulo: 'CTPS Numero', thymeleaf: '${pessoa.numeroCtps}' },
      { nome: 'pessoa.serieCtps', rotulo: 'CTPS Serie', thymeleaf: '${pessoa.serieCtps}' },
      { nome: 'pessoa.dataEmissaoCtps', rotulo: 'CTPS Data Emissao', thymeleaf: '${pessoa.dataEmissaoCtps}' },
      { nome: 'pessoa.numeroCnh', rotulo: 'CNH Numero', thymeleaf: '${pessoa.numeroCnh}' },
      { nome: 'pessoa.categoriaCnh', rotulo: 'CNH Categoria', thymeleaf: '${pessoa.categoriaCnh}' },
      { nome: 'pessoa.registroCnh', rotulo: 'CNH Registro', thymeleaf: '${pessoa.registroCnh}' },
      { nome: 'pessoa.validadeCnh', rotulo: 'CNH Validade', thymeleaf: '${pessoa.validadeCnh}' },
      { nome: 'pessoa.chavePix', rotulo: 'Chave Pix', thymeleaf: '${pessoa.chavePix}' },
    ]
  },
  {
    categoria: 'Vaga',
    icone: 'bi-briefcase',
    variaveis: [
      { nome: 'vaga.tipoVagaNome', rotulo: 'Tipo de Vaga', thymeleaf: '${vaga.tipoVagaNome}' },
      { nome: 'vaga.clienteNome', rotulo: 'Cliente', thymeleaf: '${vaga.clienteNome}' },
      { nome: 'vaga.cidade', rotulo: 'Cidade', thymeleaf: '${vaga.cidade}' },
      { nome: 'vaga.uf', rotulo: 'UF', thymeleaf: '${vaga.uf}' },
      { nome: 'vaga.salario', rotulo: 'Salario', thymeleaf: '${vaga.salario}' },
      { nome: 'vaga.tipoContrato', rotulo: 'Tipo Contrato', thymeleaf: '${vaga.tipoContrato}' },
      { nome: 'vaga.contratante', rotulo: 'Contratante', thymeleaf: '${vaga.contratante}' },
      { nome: 'vaga.dataAdmissao', rotulo: 'Data Admissao', thymeleaf: '${vaga.dataAdmissao}' },
      { nome: 'vaga.dataDemissao', rotulo: 'Data Demissao', thymeleaf: '${vaga.dataDemissao}' },
      { nome: 'vaga.horarioEntrada', rotulo: 'Horario Entrada', thymeleaf: '${vaga.horarioEntrada}' },
      { nome: 'vaga.horarioSaida', rotulo: 'Horario Saida', thymeleaf: '${vaga.horarioSaida}' },
      { nome: 'vaga.acrescimoOuSubstituicao', rotulo: 'Acrescimo/Substituicao', thymeleaf: '${vaga.acrescimoOuSubstituicao}' },
      { nome: 'vaga.aso', rotulo: 'ASO', thymeleaf: '${vaga.aso}' },
      { nome: 'vaga.optanteVT', rotulo: 'Optante VT', thymeleaf: '${vaga.optanteVT}' },
    ]
  },
  {
    categoria: 'Itens',
    icone: 'bi-list-ul',
    variaveis: [
      { nome: 'itens', rotulo: 'Lista de Itens (loop)', thymeleaf: 'th:each="item : ${itens}"' },
      { nome: 'item.descricao', rotulo: 'Descricao do Item', thymeleaf: '${item.descricao}' },
      { nome: 'item.quantidade', rotulo: 'Quantidade', thymeleaf: '${item.quantidade}' },
    ]
  },
  {
    categoria: 'Utilitarios',
    icone: 'bi-tools',
    variaveis: [
      { nome: 'dataAtual', rotulo: 'Data Atual', thymeleaf: "${#dates.format(#dates.createNow(), 'dd/MM/yyyy')}" },
      { nome: 'dataAtualExtenso', rotulo: 'Data Atual por Extenso', thymeleaf: "${#dates.format(#dates.createNow(), 'dd MMMM yyyy')}" },
    ]
  }
];
