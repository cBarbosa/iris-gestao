using IrisGestao.Domain.Entity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace IrisGestao.Infraestructure.ORM;

public partial class IrisContext : DbContext
{
    protected readonly IConfiguration Configuration = null!;
    
    public IrisContext(IConfiguration Configuration)
    {
        this.Configuration = Configuration;
    }

    public IrisContext(DbContextOptions<IrisContext> options)
        : base(options)
    {

    }

    public virtual DbSet<Anexo> Anexo { get; set; } = null!;
    
    public virtual DbSet<Bancos> Bancos { get; set; }

    public virtual DbSet<CategoriaImovel> CategoriaImovel { get; set; } = null!;

    public virtual DbSet<Cliente> Cliente { get; set; } = null!;

    public virtual DbSet<Contato> Contato { get; set; } = null!;

    public virtual DbSet<ContratoAluguel> ContratoAluguel { get; set; } = null!;

    public virtual DbSet<ContratoAluguelHistoricoReajuste> ContratoAluguelHistoricoReajuste { get; set; }
    public virtual DbSet<ContratoAluguelImovel> ContratoAluguelImovel { get; set; }

    public virtual DbSet<ContratoAluguelUnidade> ContratoAluguelUnidade { get; set; }

    public virtual DbSet<ContratoFornecedor> ContratoFornecedor { get; set; } = null!;

    public virtual DbSet<DadoBancario> DadoBancario { get; set; } = null!;

    public virtual DbSet<DespesaLocatario> DespesaLocatario { get; set; } = null!;

    public virtual DbSet<DespesaProprietario> DespesaProprietario { get; set; } = null!;

    public virtual DbSet<Evento> Evento { get; set; } = null!;

    public virtual DbSet<FaturaTitulo> FaturaTitulo { get; set; } = null!;

    public virtual DbSet<FaturaTituloPagar> FaturaTituloPagar { get; set; } = null!;

    public virtual DbSet<FormaPagamento> FormaPagamento { get; set; } = null!;

    public virtual DbSet<Fornecedor> Fornecedor { get; set; } = null!;

    public virtual DbSet<Imovel> Imovel { get; set; } = null!;

    public virtual DbSet<ImovelEndereco> ImovelEndereco { get; set; } = null!;

    public virtual DbSet<IndiceReajuste> IndiceReajuste { get; set; } = null!;

    public virtual DbSet<NotaFiscal> NotaFiscal { get; set; } = null!;

    public virtual DbSet<Obra> Obra { get; set; } = null!;

    public virtual DbSet<Orcamento> Orcamento { get; set; } = null!;

    public virtual DbSet<TipoCliente> TipoCliente { get; set; } = null!;

    public virtual DbSet<TipoContrato> TipoContrato { get; set; } = null!;

    public virtual DbSet<TipoCreditoAluguel> TipoCreditoAluguel { get; set; } = null!;

    public virtual DbSet<TipoDespesa> TipoDespesa { get; set; } = null!;

    public virtual DbSet<TipoEvento> TipoEvento { get; set; } = null!;

    public virtual DbSet<TipoServico> TipoServico { get; set; } = null!;

    public virtual DbSet<TipoTitulo> TipoTitulo { get; set; } = null!;

    public virtual DbSet<TipoUnidade> TipoUnidade { get; set; } = null!;

    public virtual DbSet<TituloReceber> TituloReceber { get; set; } = null!;
    public virtual DbSet<TituloPagar> TituloPagar { get; set; } = null!;

    public virtual DbSet<TituloImovel> TituloImovel { get; set; }
    
    public virtual DbSet<TituloUnidade> TituloUnidade { get; set; }

    public virtual DbSet<Unidade> Unidade { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(Configuration.GetConnectionString("SQLConnection"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Anexo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Anexo__3214EC0789E97BE1");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");
        });
        
        modelBuilder.Entity<Bancos>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Bancos_PK");
        });

        modelBuilder.Entity<CategoriaImovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07980F07FC");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cliente__3214EC0757390793");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTipoClienteNavigation).WithMany(p => p.Cliente).HasConstraintName("fk_Cliente_TipoCliente");
        });

        modelBuilder.Entity<Contato>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contato__3214EC075FC95E7B");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Contato).HasConstraintName("fk_Contato_Cliente");

            entity.HasOne(d => d.IdFornecedorNavigation).WithMany(p => p.Contato).HasConstraintName("fk_Contato_Fornecedor");
        });

        modelBuilder.Entity<ContratoAluguel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC07A0145D0B");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.ContratoAluguel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_ContratoAluguel");

            entity.HasOne(d => d.IdIndiceReajusteNavigation).WithMany(p => p.ContratoAluguel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_IndiceReajuste_ContratoAluguel");

            entity.HasOne(d => d.IdTipoContratoNavigation).WithMany(p => p.ContratoAluguel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoContrato_ContratoAluguel");

            entity.HasOne(d => d.IdTipoCreditoAluguelNavigation).WithMany(p => p.ContratoAluguel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoCreditoAluguel_ContratoAluguel");
        });

        modelBuilder.Entity<ContratoAluguelHistoricoReajuste>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC071E103FF9");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.ContratoAluguelHistoricoReajuste)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelHistoricoReajuste_ContratoAluguel");
        });

        modelBuilder.Entity<ContratoAluguelImovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC071E103FF9");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.ContratoAluguelImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelImovel_ContratoAluguel");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ContratoAluguelImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelImovel_Imovel");
        });
        
        modelBuilder.Entity<ContratoAluguelUnidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC07C8AD6C60");

            entity.HasOne(d => d.IdContratoAluguelImovelNavigation).WithMany(p => p.ContratoAluguelUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelUnidade_ContratoAluguelImovel");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.ContratoAluguelUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelUnidade_Unidade");
        });

        modelBuilder.Entity<ContratoFornecedor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC0705E0D2A7");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_ContratoFornecedor");

            entity.HasOne(d => d.IdFornecedorNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("[fk_ContratoFornecedor_Fornecedor]");

            entity.HasOne(d => d.IdFormaPagamentoNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_FormaPagamento_ContratoFornecedor");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_ContratoFornecedor");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoFornecedor_Unidade");

            entity.HasOne(d => d.IdIndiceReajusteNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_IndiceReajuste_ContratoFornecedor");

            entity.HasOne(d => d.IdTipoServicoNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoServico_ContatoFornecedor");
        });

        modelBuilder.Entity<DadoBancario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DadoBanc__3214EC078DAD5BD6");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");
            
            entity.HasOne(d => d.IdBancoNavigation).WithMany(p => p.DadoBancario).HasConstraintName("FK_DadoBancario_Bancos");
        });

        modelBuilder.Entity<DespesaLocatario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DespesaL__3214EC07E7605EA9");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.DespesaLocatario).HasConstraintName("fk_Cliente_DespesaLocatario");

            entity.HasOne(d => d.IdTipoDespesaNavigation).WithMany(p => p.DespesaLocatario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoDespesa_DespesaLocatario");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.DespesaLocatario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Unidade_DespesaLocatario");
        });

        modelBuilder.Entity<DespesaProprietario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DespesaP__3214EC071FE0AF7B");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdContratoFornecedorNavigation).WithMany(p => p.DespesaProprietario).HasConstraintName("fk_ContratoFornecedor_DespesaProprietario");

            entity.HasOne(d => d.IdTipoDespesaNavigation).WithMany(p => p.DespesaProprietario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoDespesa_DespesaProprietario");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.DespesaProprietario)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Unidade_DespesaProprietario");
        });

        modelBuilder.Entity<Evento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Evento__3214EC07454993EE");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Evento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_Evento");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.Evento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_Evento");

            entity.HasOne(d => d.IdTipoEventoNavigation).WithMany(p => p.Evento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoEvento_Evento");
        });

        modelBuilder.Entity<FaturaTitulo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FaturaTi__3214EC07D65B2553");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTituloReceberNavigation).WithMany(p => p.FaturaTitulo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Titulo_FaturaTitulo");
        });

        modelBuilder.Entity<FaturaTituloPagar>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FaturaTiPag__3214EC07D65B2553");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTituloPagarNavigation).WithMany(p => p.FaturaTituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloPagar_FaturaTituloPagar");
        });

        modelBuilder.Entity<TituloImovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloImovel__3214EC071E103FF9");

            entity.HasOne(d => d.IdTituloReceberNavigation).WithMany(p => p.TituloImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloImovel_TituloReceber");

            entity.HasOne(d => d.IdTituloPagarNavigation).WithMany(p => p.TituloImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloImovel_TituloPagar");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.TituloImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloImovel_Imovel");
        });

        modelBuilder.Entity<TituloUnidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloUnidade__3214EC07C8AD6C60");

            entity.HasOne(d => d.IdTituloImovelNavigation).WithMany(p => p.TituloUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloUnidade_TituloImovel");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.TituloUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloUnidade_Unidade");
        });

        modelBuilder.Entity<FormaPagamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FormaPag__3214EC07339B3487");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<Fornecedor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Forneced__3214EC0745F417AA");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.Property(e => e.Status).HasDefaultValueSql("((1))");

            entity.HasOne(d => d.IdDadoBancarioNavigation).WithMany(p => p.Fornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_DadoBancario_Fornecedor");
        });

        modelBuilder.Entity<Imovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Imovel__3214EC07850C004D");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdCategoriaImovelNavigation).WithMany(p => p.Imovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_CategoriaImovel_Imovel");

            entity.HasOne(d => d.IdClienteProprietarioNavigation).WithMany(p => p.Imovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_ClienteProprietario");
        });

        modelBuilder.Entity<ImovelEndereco>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ImovelEn__3214EC07CBE1BD40");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ImovelEndereco)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ImovelEndereco_Imovel");
        });

        modelBuilder.Entity<IndiceReajuste>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__IndiceRe__3214EC07E8989E25");
        });

        modelBuilder.Entity<NotaFiscal>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__NotaFisc__3214EC074EA91E7D");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdObraNavigation).WithMany(p => p.NotaFiscal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Obra_NotaFiscal");

            entity.HasOne(d => d.IdTipoServicoNavigation).WithMany(p => p.NotaFiscal)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoServico_NotaFiscal");
        });

        modelBuilder.Entity<Obra>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Obra__3214EC0729D49DC7");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.Obra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_Obra");

            entity.HasOne(d => d.IdOrcamentoNavigation).WithMany(p => p.Obra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Orcamento_Obra");
        });

        modelBuilder.Entity<Orcamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Orcament__3214EC07A8D543C8");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTipoServicoNavigation).WithMany(p => p.Orcamento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoServico_Orcamento");
        });

        modelBuilder.Entity<TipoCliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoClie__3214EC078042100E");
        });

        modelBuilder.Entity<TipoContrato>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoCont__3214EC0705BF0ECA");
        });

        modelBuilder.Entity<TipoCreditoAluguel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoCred__3214EC07DD18346D");
        });

        modelBuilder.Entity<TipoDespesa>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoDesp__3214EC072E166AF5");
        });

        modelBuilder.Entity<TipoEvento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoEven__3214EC07DC5B9792");
        });

        modelBuilder.Entity<TipoServico>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoServ__3214EC076F299EAA");
        });

        modelBuilder.Entity<TipoTitulo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoTitu__3214EC07087C10A5");
        });

        modelBuilder.Entity<TipoUnidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoUnid__3214EC077870DCC7");
        });

        modelBuilder.Entity<TituloReceber>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloRecebe__3214EC078550CE76");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTipoTituloNavigation).WithMany(p => p.TituloReceber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoTitulo_Titulo");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.TituloReceber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguel_TituloReceber");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.TituloReceber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_TituloReceber");

            entity.HasOne(d => d.IdIndiceReajusteNavigation).WithMany(p => p.TituloReceber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_IndiceReajuste_ContratoAluguel");

            entity.HasOne(d => d.IdTipoCreditoAluguelNavigation).WithMany(p => p.TituloReceber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoCreditoAluguel_ContratoAluguel");

            entity.HasOne(d => d.IdFormaPagamentoNavigation).WithMany(p => p.TituloReceber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_FormaPagamento_TituloReceber");
        });

        modelBuilder.Entity<TituloPagar>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloPagar__3214EC078550CE76");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTipoTituloNavigation).WithMany(p => p.TituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoTitulo_Titulo");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.TituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguel_TituloPagar");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.TituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_TituloPagar");

            entity.HasOne(d => d.IdIndiceReajusteNavigation).WithMany(p => p.TituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_IndiceReajuste_ContratoAluguel");

            entity.HasOne(d => d.IdTipoCreditoAluguelNavigation).WithMany(p => p.TituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoCreditoAluguel_ContratoAluguel");

            entity.HasOne(d => d.IdFormaPagamentoNavigation).WithMany(p => p.TituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_FormaPagamento_TituloPagar");
        });

        modelBuilder.Entity<Unidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Unidade__3214EC075A1ECD2B");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.Unidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_Unidade");

            entity.HasOne(d => d.IdTipoUnidadeNavigation).WithMany(p => p.Unidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoUnidade_Unidade");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
