BEGIN TRANSACTION
SET QUOTED_IDENTIFIER ON
SET ARITHABORT ON
SET NUMERIC_ROUNDABORT OFF
SET CONCAT_NULL_YIELDS_NULL ON
SET ANSI_NULLS ON
SET ANSI_PADDING ON
SET ANSI_WARNINGS ON
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Bancos SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.DadoBancario
	DROP CONSTRAINT DF_DadoBancario
GO
CREATE TABLE dbo.Tmp_DadoBancario
	(
	Id int NOT NULL IDENTITY (1, 1),
	IdBanco int NULL,
	Agencia int NOT NULL,
	Operacao int NULL,
	Conta int NOT NULL,
	Banco varchar(100) NOT NULL,
	ChavePix varchar(60) NULL,
	DataCriacao datetime NULL,
	GuidReferencia uniqueidentifier NULL
	)  ON [PRIMARY]
GO
ALTER TABLE dbo.Tmp_DadoBancario SET (LOCK_ESCALATION = TABLE)
GO
ALTER TABLE dbo.Tmp_DadoBancario ADD CONSTRAINT
	DF_DadoBancario DEFAULT (getdate()) FOR DataCriacao
GO
SET IDENTITY_INSERT dbo.Tmp_DadoBancario ON
GO
IF EXISTS(SELECT * FROM dbo.DadoBancario)
	 EXEC('INSERT INTO dbo.Tmp_DadoBancario (Id, IdBanco, Agencia, Operacao, Conta, Banco, ChavePix, DataCriacao, GuidReferencia)
		SELECT Id, IdBanco, Agencia, Operacao, Conta, Banco, ChavePix, DataCriacao, GuidReferencia FROM dbo.DadoBancario WITH (HOLDLOCK TABLOCKX)')
GO
SET IDENTITY_INSERT dbo.Tmp_DadoBancario OFF
GO
ALTER TABLE dbo.Fornecedor
	DROP CONSTRAINT fk_DadoBancario_Fornecedor
GO
DROP TABLE dbo.DadoBancario
GO
EXECUTE sp_rename N'dbo.Tmp_DadoBancario', N'DadoBancario', 'OBJECT' 
GO
ALTER TABLE dbo.DadoBancario ADD CONSTRAINT
	PK__DadoBanc__3214EC078DAD5BD6 PRIMARY KEY CLUSTERED 
	(
	Id
	) WITH( STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]

GO
ALTER TABLE dbo.DadoBancario ADD CONSTRAINT
	FK_DadoBancario_Bancos FOREIGN KEY
	(
	IdBanco
	) REFERENCES dbo.Bancos
	(
	Id
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
COMMIT
BEGIN TRANSACTION
GO
ALTER TABLE dbo.Fornecedor ADD CONSTRAINT
	fk_DadoBancario_Fornecedor FOREIGN KEY
	(
	IdDadoBancario
	) REFERENCES dbo.DadoBancario
	(
	Id
	) ON UPDATE  NO ACTION 
	 ON DELETE  NO ACTION 
	
GO
ALTER TABLE dbo.Fornecedor SET (LOCK_ESCALATION = TABLE)
GO
COMMIT
