CREATE TABLE Bancos (
	Id int IDENTITY(0,1) NOT NULL,
	Codigo varchar(10) NOT NULL,
	Descricao varchar(100) NOT NULL,
	CONSTRAINT Bancos_PK PRIMARY KEY (Id)
);

ALTER TABLE DadoBancario ADD IdBanco int NULL;

Insert Into Bancos(Codigo, Descricao)
Values
('001', 'BANCO DO BRASIL S.A (BB)'),
('104', 'CAIXA ECONÔMICA FEDERAL (CEF)');