USE [Constutora-DEV]
/*GO
INSERT INTO [dbo].[CategoriaImovel] VALUES ('Imóvel de carteira'),
('Imóvel de Mercado');
GO

GO
INSERT INTO [dbo].[TipoUnidade] VALUES ('Edifício Corporativo'),
('Sala'),
('Pavimento Corporativo'),
('Loja Comercial');
GO

GO
INSERT INTO [dbo].[IndiceReajuste] ([Nome],[Percentual],[DataAtualizacao])
     VALUES ('IGPM',1,GETDATE()),
	 ('IPCA',0,GETDATE());
GO

GO
INSERT INTO [dbo].[TipoContrato] VALUES ('Comercial'),
('Residencial');
GO

GO
INSERT INTO [dbo].[FormaPagamento] VALUES ('PIX'),
('Boleto'),
('TED'),
('DOC');
GO


GO
INSERT INTO [dbo].[PlanoConta] VALUES ('IPTU'),
('Indenização'),
('Reembolso'),
('DOC');
GO

INSERT INTO [dbo].[TipoDespesa] VALUES ('Despesas com vazios'),
('Manutenções'),
('Benfeitorias (Obras)'),
('Obrigações contratuais (Despesas previstas em contrato)'),
('Outros');
GO

INSERT INTO [dbo].[TipoEvento] VALUES ('Venda'),
('Inauguração'),
('Aquisição'),
('Abertura'),
('Início de Obras',);
GO

INSERT INTO [dbo].[TipoCliente] VALUES ('Proprietário'),
('Locatário'),
('Prospect');
GO

INSERT INTO [dbo].[TipoCreditoAluguel] VALUES ('Locador'),
('Administradora');
GO

*/

SELECT * FROM TipoCliente
SELECT * FROM CategoriaImovel
SELECT * FROM TipoUnidade
SELECT * FROM IndiceReajuste
SELECT * FROM TipoContrato
SELECT * FROM FormaPagamento
SELECT * FROM PlanoConta
SELECT * FROM TipoDespesa
SELECT * FROM TipoEvento
SELECT * FROM TipoEvento
SELECT * FROM TipoCreditoAluguel