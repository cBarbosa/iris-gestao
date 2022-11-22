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

    public virtual DbSet<CategoriaImovel> CategoriaImovel { get; set; } = null!;

    public virtual DbSet<Cliente> Cliente { get; set; } = null!;

    public virtual DbSet<Contato> Contato { get; set; } = null!;

    public virtual DbSet<ContratoAluguel> ContratoAluguel { get; set; } = null!;

    public virtual DbSet<ContratoFornecedor> ContratoFornecedor { get; set; } = null!;

    public virtual DbSet<DadoBancario> DadoBancario { get; set; } = null!;

    public virtual DbSet<DespesaLocatario> DespesaLocatario { get; set; } = null!;

    public virtual DbSet<DespesaProprietario> DespesaProprietario { get; set; } = null!;

    public virtual DbSet<Evento> Evento { get; set; } = null!;

    public virtual DbSet<FaturaTitulo> FaturaTitulo { get; set; } = null!;

    public virtual DbSet<FormaPagamento> FormaPagamento { get; set; } = null!;

    public virtual DbSet<Fornecedor> Fornecedor { get; set; } = null!;

    public virtual DbSet<Imovel> Imovel { get; set; } = null!;

    public virtual DbSet<ImovelEndereco> ImovelEndereco { get; set; } = null!;

    public virtual DbSet<IndiceReajuste> IndiceReajuste { get; set; } = null!;

    public virtual DbSet<NotaFiscal> NotaFiscal { get; set; } = null!;

    public virtual DbSet<Obra> Obra { get; set; } = null!;

    public virtual DbSet<Orcamento> Orcamento { get; set; } = null!;

    public virtual DbSet<TipoContrato> TipoContrato { get; set; } = null!;

    public virtual DbSet<TipoCreditoAluguel> TipoCreditoAluguel { get; set; } = null!;

    public virtual DbSet<TipoDespesa> TipoDespesa { get; set; } = null!;

    public virtual DbSet<TipoEvento> TipoEvento { get; set; } = null!;

    public virtual DbSet<TipoServico> TipoServico { get; set; } = null!;

    public virtual DbSet<TipoTitulo> TipoTitulo { get; set; } = null!;

    public virtual DbSet<TipoUnidade> TipoUnidade { get; set; } = null!;

    public virtual DbSet<Titulo> Titulo { get; set; } = null!;

    public virtual DbSet<Unidade> Unidade { get; set; } = null!;

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        => optionsBuilder.UseSqlServer(Configuration.GetConnectionString("SQLConnection"));

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Anexo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Anexo__3214EC0789E97BE1");
        });

        modelBuilder.Entity<CategoriaImovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07980F07FC");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cliente__3214EC0757390793");
        });

        modelBuilder.Entity<Contato>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contato__3214EC075FC95E7B");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Contato).HasConstraintName("fk_Contato_Cliente");

            entity.HasOne(d => d.IdFornecedorNavigation).WithMany(p => p.Contato).HasConstraintName("fk_Contato_Fornecedor");
        });

        modelBuilder.Entity<ContratoAluguel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC07A0145D0B");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.ContratoAluguel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_ContratoAluguel");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ContratoAluguel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_ContratoAluguel");

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

        modelBuilder.Entity<ContratoFornecedor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC0705E0D2A7");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_ContratoFornecedor");

            entity.HasOne(d => d.IdFormaPagamentoNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_FormaPagamento_ContratoFornecedor");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_ContratoFornecedor");

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
        });

        modelBuilder.Entity<DespesaLocatario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DespesaL__3214EC07E7605EA9");

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

            entity.HasOne(d => d.IdTituloNavigation).WithMany(p => p.FaturaTitulo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Titulo_FaturaTitulo");
        });

        modelBuilder.Entity<FormaPagamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FormaPag__3214EC07339B3487");
        });

        modelBuilder.Entity<Fornecedor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Forneced__3214EC0745F417AA");

            entity.HasOne(d => d.IdDadoBancarioNavigation).WithMany(p => p.Fornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_DadoBancario_Fornecedor");
        });

        modelBuilder.Entity<Imovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Imovel__3214EC07850C004D");

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

            entity.HasOne(d => d.IdTipoServicoNavigation).WithMany(p => p.Orcamento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoServico_Orcamento");
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

        modelBuilder.Entity<Titulo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Titulo__3214EC078550CE76");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.Titulo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_Titulo");

            entity.HasOne(d => d.IdTipoTituloNavigation).WithMany(p => p.Titulo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoTitulo_Titulo");
        });

        modelBuilder.Entity<Unidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Unidade__3214EC075A1ECD2B");

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
