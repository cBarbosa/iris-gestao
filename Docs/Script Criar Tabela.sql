CREATE TABLE Anexo  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  Local text NOT NULL,
  GuidReferencia varchar(50) NOT NULL,
  MineType varchar(10) NULL,
  Tamanho int NULL,
  Classificacao varchar(50) NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE CategoriaImovel  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Cliente  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  RazaoSocial varchar(100) NOT NULL,
  Endereco varchar(100) NOT NULL,
  Bairro varchar(50) NOT NULL,
  Cidade varchar(50) NOT NULL,
  Estado varchar(2) NOT NULL,
  Cep int NOT NULL,
  DataNascimento date NULL,
  Nps int NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Contato  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdFornecedor int NULL,
  IdCliente int NULL,
  Nome varchar(100) NOT NULL,
  Email varchar(60) NOT NULL,
  Telefone varchar(11) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE ContratoAluguel  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdCliente int NOT NULL,
  IdImovel int NOT NULL,
  IdTipoCreditoAluguel int NOT NULL,
  IdIndiceReajuste int NOT NULL,
  IdTipoContrato int NOT NULL,
  NumeroContrato varchar(100) NOT NULL,
  ValorAluguel decimal(18, 0) NOT NULL,
  PercentualRetencaoImpostos decimal(3, 0) NOT NULL,
  ValorAluguelLiquido decimal(18, 0) NOT NULL,
  PercentualDescontoAluguel int NULL,
  CarenciaAluguel tinyint NOT NULL,
  PrazoCarencia int NULL,
  DataInicioContrato date NOT NULL,
  PrazoTotalContrato int NOT NULL,
  DataFimContrato date NOT NULL,
  DataOcupacao date NULL,
  DiaVencimentoAluguel int NOT NULL,
  PeriodicidadeReajuste int NOT NULL,
  GuidReferencia varchar(50) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE ContratoFornecedor  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdCliente int NOT NULL,
  IdImovel int NOT NULL,
  IdFormaPagamento int NOT NULL,
  IdIndiceReajuste int NOT NULL,
  IdTipoServico int NOT NULL,
  NumeroContrato varchar(50) NOT NULL,
  Percentual int NULL,
  DataAtualizacao date NOT NULL,
  ValorServicoContratado decimal(18, 0) NOT NULL,
  DataInicioContrato date NOT NULL,
  PrazoTotalMeses int NOT NULL,
  DataFimContrato date NOT NULL,
  DiaPagamento int NOT NULL,
  PeriodicidadeReajuste int NOT NULL,
  GuidReferencia varchar(50) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE DadoBancario  (
  Id int  IDENTITY(1,1) NOT NULL,
  Agencia int NOT NULL,
  Operacao int NULL,
  Conta int NOT NULL,
  Banco varchar(100) NOT NULL,
  ChavePix varchar(60) NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE DespesaLocatario  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdTipoDespesa int NOT NULL,
  IdUnidade int NOT NULL,
  IdCliente int NULL,
  Nome varchar(120) NULL,
  DataReferencia date NULL,
  DataPagamento date NULL,
  DataBaixa date NULL,
  Valor decimal(18, 0) NULL,
  FaturaBaixada bit NULL,
  Observacao text NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE DespesaProprietario  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdTipoDespesa int NOT NULL,
  IdUnidade int NOT NULL,
  IdContratoFornecedor int NULL,
  Nome varchar(120) NULL,
  DataReferencia date NULL,
  Valor decimal(18, 0) NULL,
  Observacao text NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Evento  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdImovel int NOT NULL,
  IdTipoEvento int NOT NULL,
  Nome varchar(200) NOT NULL,
  DthRealizacao datetime NULL,
  GuidReferencia varchar(50) NOT NULL,
  IdCliente int NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE FaturaTitulo  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdTitulo int NOT NULL,
  NumeroFatura varchar(50) NOT NULL,
  Valor decimal(10, 2) NULL,
  DataEnvio datetime NOT NULL,
  DataPagamento date NULL,
  DataVencimento date NULL,
  DiasAtraso integer NULL,
  NumeroNotaFiscal varchar(255) NULL,
  DataEmissãoNotaFiscal date NULL,
  ValorTaxaAdministracao decimal(10, 2) NULL,
  PorcentagemImpostoRetido decimal(10, 2) NULL,
  ValorLiquidoTaxaAdministracao decimal(10, 2) NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE FormaPagamento  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Fornecedor  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdDadoBancario int NOT NULL,
  Nome varchar(100) NOT NULL,
  RazaoSocial varchar(100) NOT NULL,
  Endereco varchar(100) NOT NULL,
  Bairro varchar(50) NOT NULL,
  Cidade varchar(50) NOT NULL,
  Estado varchar(2) NOT NULL,
  Cep int NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Imovel  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdCategoriaImovel int NOT NULL,
  IdClienteProprietario int NOT NULL,
  NumCentroCusto int NOT NULL,
  MonoUsuario tinyint NOT NULL,
  MineType varchar(10) NULL,
  Classificacao varchar(50) NULL,
  GuidReferencia varchar(50) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE ImovelEndereco  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdImovel int NOT NULL,
  Rua varchar(100) NOT NULL,
  Complemento varchar(50) NOT NULL,
  Bairro varchar(50) NULL,
  Cidade varchar(50) NULL,
  UF varchar(2) NOT NULL,
  Cep int NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE IndiceReajuste  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(50) NOT NULL,
  Percentual int NULL,
  DataAtualizacao date NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE NotaFiscal  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdTipoServico int NOT NULL,
  IdObra int NOT NULL,
  NumeroNota varchar(50) NOT NULL,
  DataEmissao datetime NOT NULL,
  Valor decimal(18, 0) NOT NULL,
  PercentualAdministracaoObra int NOT NULL,
  GuidReferencia varchar(50) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Obra  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdImovel int NOT NULL,
  IdOrcamento int NOT NULL,
  DataInicio date NULL,
  DataPrevistaTermino date NULL,
  GuidReferencia varchar(50) NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Orcamento  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdTipoServico int NOT NULL,
  ValorEstimado decimal(18, 0) NOT NULL,
  ValorContratado decimal(18, 0) NOT NULL,
  Saldo decimal(18, 0) NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE TipoTitulo  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(50) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE TipoContrato  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(60) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE TipoCreditoAluguel  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE TipoDespesa  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE TipoEvento  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE TipoServico  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(100) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE TipoUnidade  (
  Id int  IDENTITY(1,1) NOT NULL,
  Nome varchar(50) NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Titulo  (
  Id int  IDENTITY(1,1) NOT NULL,
  NumeroTitulo varchar(100) NOT NULL,
  IdTipoTitulo int NOT NULL,
  IdImovel int NOT NULL,
  CreditoLocador tinyint NOT NULL,
  CreditoAdministrado tinyint NOT NULL,
  ValorTitulo decimal(18, 0) NOT NULL,
  Parcelas int NOT NULL,
  PRIMARY KEY (Id)
);

CREATE TABLE Unidade  (
  Id int  IDENTITY(1,1) NOT NULL,
  IdImovel int NOT NULL,
  IdTipoUnidade int NOT NULL,
  Tipo varchar(50) NOT NULL,
  AreaUtil decimal(18, 0) NOT NULL,
  AreaTotal decimal(18, 0) NOT NULL,
  AreaHabitese decimal(18, 0) NULL,
  Matricula varchar(50) NULL,
  InscricaoIPTU varchar(60) NULL,
  MatriculaEnergia varchar(50) NULL,
  MatriculaAgua varchar(50) NULL,
  TaxaAdministracao decimal(18, 0) NULL,
  ValorPotencial decimal(18, 0) NULL,
  UnidadeLocada tinyint NOT NULL,
  GuidReferencia varchar(50) NOT NULL,
  PRIMARY KEY (Id)
);

ALTER TABLE Contato ADD CONSTRAINT fk_Contato_Cliente FOREIGN KEY (IdCliente) REFERENCES Cliente (Id);
ALTER TABLE Contato ADD CONSTRAINT fk_Contato_Fornecedor FOREIGN KEY (IdFornecedor) REFERENCES Fornecedor (Id);
ALTER TABLE ContratoAluguel ADD CONSTRAINT fk_TipoCreditoAluguel_ContratoAluguel FOREIGN KEY (IdTipoCreditoAluguel) REFERENCES TipoCreditoAluguel (Id);
ALTER TABLE ContratoAluguel ADD CONSTRAINT fk_IndiceReajuste_ContratoAluguel FOREIGN KEY (IdIndiceReajuste) REFERENCES IndiceReajuste (Id);
ALTER TABLE ContratoAluguel ADD CONSTRAINT fk_TipoContrato_ContratoAluguel FOREIGN KEY (IdTipoContrato) REFERENCES TipoContrato (Id);
ALTER TABLE ContratoAluguel ADD CONSTRAINT fk_Cliente_ContratoAluguel FOREIGN KEY (IdCliente) REFERENCES Cliente (Id);
ALTER TABLE ContratoAluguel ADD CONSTRAINT fk_Imovel_ContratoAluguel FOREIGN KEY (IdImovel) REFERENCES Imovel (Id);
ALTER TABLE ContratoFornecedor ADD CONSTRAINT fk_Cliente_ContratoFornecedor FOREIGN KEY (IdCliente) REFERENCES Cliente (Id);
ALTER TABLE ContratoFornecedor ADD CONSTRAINT fk_Imovel_ContratoFornecedor FOREIGN KEY (IdImovel) REFERENCES Imovel (Id);
ALTER TABLE ContratoFornecedor ADD CONSTRAINT fk_FormaPagamento_ContratoFornecedor FOREIGN KEY (IdFormaPagamento) REFERENCES FormaPagamento (Id);
ALTER TABLE ContratoFornecedor ADD CONSTRAINT fk_IndiceReajuste_ContratoFornecedor FOREIGN KEY (IdIndiceReajuste) REFERENCES IndiceReajuste (Id);
ALTER TABLE ContratoFornecedor ADD CONSTRAINT fk_TipoServico_ContatoFornecedor FOREIGN KEY (IdTipoServico) REFERENCES TipoServico (Id);
ALTER TABLE DespesaLocatario ADD CONSTRAINT fk_TipoDespesa_DespesaLocatario FOREIGN KEY (IdTipoDespesa) REFERENCES TipoDespesa (Id);
ALTER TABLE DespesaLocatario ADD CONSTRAINT fk_Unidade_DespesaLocatario FOREIGN KEY (IdUnidade) REFERENCES Unidade (Id);
ALTER TABLE DespesaLocatario ADD CONSTRAINT fk_Cliente_DespesaLocatario FOREIGN KEY (IdCliente) REFERENCES Cliente (Id);
ALTER TABLE DespesaProprietario ADD CONSTRAINT fk_TipoDespesa_DespesaProprietario FOREIGN KEY (IdTipoDespesa) REFERENCES TipoDespesa (Id);
ALTER TABLE DespesaProprietario ADD CONSTRAINT fk_Unidade_DespesaProprietario FOREIGN KEY (IdUnidade) REFERENCES Unidade (Id);
ALTER TABLE DespesaProprietario ADD CONSTRAINT fk_ContratoFornecedor_DespesaProprietario FOREIGN KEY (IdContratoFornecedor) REFERENCES ContratoFornecedor (Id);
ALTER TABLE Evento ADD CONSTRAINT fk_TipoEvento_Evento FOREIGN KEY (IdTipoEvento) REFERENCES TipoEvento (Id);
ALTER TABLE Evento ADD CONSTRAINT fk_Cliente_Evento FOREIGN KEY (IdCliente) REFERENCES Cliente (Id);
ALTER TABLE Evento ADD CONSTRAINT fk_Imovel_Evento FOREIGN KEY (IdImovel) REFERENCES Imovel (Id);
ALTER TABLE FaturaTitulo ADD CONSTRAINT fk_Titulo_FaturaTitulo FOREIGN KEY (IdTitulo) REFERENCES Titulo (Id);
ALTER TABLE Fornecedor ADD CONSTRAINT fk_DadoBancario_Fornecedor FOREIGN KEY (IdDadoBancario) REFERENCES DadoBancario (Id);
ALTER TABLE Imovel ADD CONSTRAINT fk_Cliente_ClienteProprietario FOREIGN KEY (IdClienteProprietario) REFERENCES Cliente (Id);
ALTER TABLE Imovel ADD CONSTRAINT fk_CategoriaImovel_Imovel FOREIGN KEY (IdCategoriaImovel) REFERENCES CategoriaImovel (Id);
ALTER TABLE ImovelEndereco ADD CONSTRAINT fk_ImovelEndereco_Imovel FOREIGN KEY (IdImovel) REFERENCES Imovel (Id);
ALTER TABLE NotaFiscal ADD CONSTRAINT fk_TipoServico_NotaFiscal FOREIGN KEY (IdTipoServico) REFERENCES TipoServico (Id);
ALTER TABLE NotaFiscal ADD CONSTRAINT fk_Obra_NotaFiscal FOREIGN KEY (IdObra) REFERENCES Obra (Id);
ALTER TABLE Obra ADD CONSTRAINT fk_Orcamento_Obra FOREIGN KEY (IdOrcamento) REFERENCES Orcamento (Id);
ALTER TABLE Obra ADD CONSTRAINT fk_Imovel_Obra FOREIGN KEY (IdImovel) REFERENCES Imovel (Id);
ALTER TABLE Orcamento ADD CONSTRAINT fk_TipoServico_Orcamento FOREIGN KEY (IdTipoServico) REFERENCES TipoServico (Id);
ALTER TABLE Titulo ADD CONSTRAINT fk_TipoTitulo_Titulo FOREIGN KEY (IdTipoTitulo) REFERENCES TipoTitulo (Id);
ALTER TABLE Titulo ADD CONSTRAINT fk_Imovel_Titulo FOREIGN KEY (IdImovel) REFERENCES Imovel (Id);
ALTER TABLE Unidade ADD CONSTRAINT fk_TipoUnidade_Unidade FOREIGN KEY (IdTipoUnidade) REFERENCES TipoUnidade (Id);
ALTER TABLE Unidade ADD CONSTRAINT fk_Imovel_Unidade FOREIGN KEY (IdImovel) REFERENCES Imovel (Id);

