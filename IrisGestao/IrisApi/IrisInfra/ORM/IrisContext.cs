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
    public virtual DbSet<EventoUnidade> EventoUnidade { get; set; } = null!;
    public virtual DbSet<FaturaTitulo> FaturaTitulo { get; set; } = null!;
    public virtual DbSet<FaturaTituloPagar> FaturaTituloPagar { get; set; } = null!;
    public virtual DbSet<FormaPagamento> FormaPagamento { get; set; } = null!;
    public virtual DbSet<Fornecedor> Fornecedor { get; set; } = null!;
    public virtual DbSet<Imovel> Imovel { get; set; } = null!;
    public virtual DbSet<ImovelEndereco> ImovelEndereco { get; set; } = null!;
    public virtual DbSet<IndiceReajuste> IndiceReajuste { get; set; } = null!;
    public virtual DbSet<Obra> Obra { get; set; } = null!;
    public virtual DbSet<ObraUnidade> ObraUnidade { get; set; }
    public virtual DbSet<ObraServico> ObraServico { get; set; }
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
            entity.HasKey(e => e.Id).HasName("PK__Categori__3214EC07D1F49463");
        });

        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Cliente__3214EC0757390793");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTipoClienteNavigation).WithMany(p => p.Cliente).HasConstraintName("fk_Cliente_TipoCliente");
        });

        modelBuilder.Entity<Contato>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contato__3214EC075C95B1F1");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Contato).HasConstraintName("fk_Contato_Cliente");

            entity.HasOne(d => d.IdFornecedorNavigation).WithMany(p => p.Contato).HasConstraintName("fk_Contato_Fornecedor");
        });

        modelBuilder.Entity<ContratoAluguel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC0780CC6A73");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status).HasDefaultValueSql("((1))");

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
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC074B7B8A28");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.ContratoAluguelHistoricoReajuste)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelHistoricoReajuste_ContratoAluguel");
        });

        modelBuilder.Entity<ContratoAluguelImovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC07F18D5A89");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.ContratoAluguelImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelImovel_ContratoAluguel");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ContratoAluguelImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelImovel_Imovel");
        });

        modelBuilder.Entity<ContratoAluguelUnidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC07AA4F5A32");

            entity.HasOne(d => d.IdContratoAluguelImovelNavigation).WithMany(p => p.ContratoAluguelUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelUnidade_ContratoAluguelImovel");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.ContratoAluguelUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ContratoAluguelUnidade_Unidade");
        });

        modelBuilder.Entity<ContratoFornecedor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Contrato__3214EC076167B736");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.ContratoFornecedor).HasConstraintName("fk_Cliente_ContratoFornecedor");

            entity.HasOne(d => d.IdFormaPagamentoNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_FormaPagamento_ContratoFornecedor");

            entity.HasOne(d => d.IdFornecedorNavigation).WithMany(p => p.ContratoFornecedor).HasConstraintName("fk_ContratoFornecedor_Fornecedor");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_ContratoFornecedor");

            entity.HasOne(d => d.IdIndiceReajusteNavigation).WithMany(p => p.ContratoFornecedor)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_IndiceReajuste_ContratoFornecedor");

            entity.HasOne(d => d.IdTipoServicoNavigation).WithMany(p => p.ContratoFornecedor).HasConstraintName("fk_TipoServico_ContatoFornecedor");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.ContratoFornecedor).HasConstraintName("fk_ContratoFornecedor_Unidade");
        });

        modelBuilder.Entity<DadoBancario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DadoBanc__3214EC078DAD5BD6");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdBancoNavigation).WithMany(p => p.DadoBancario).HasConstraintName("FK_DadoBancario_Bancos");
        });

        modelBuilder.Entity<DespesaLocatario>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__DespesaL__3214EC0781138B23");

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
            entity.HasKey(e => e.Id).HasName("PK__DespesaP__3214EC07144E350F");

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
            entity.HasKey(e => e.Id).HasName("PK__Evento__3214EC072772F811");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.Evento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Cliente_Evento");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.Evento)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_Evento");

            entity.HasOne(d => d.IdTipoEventoNavigation).WithMany(p => p.Evento).HasConstraintName("fk_TipoEvento_Evento");
        });

        modelBuilder.Entity<EventoUnidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__EventoUn__3214EC07B8715638");

            entity.HasOne(d => d.IdEventoNavigation).WithMany(p => p.EventoUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_EventoUnidade_Evento");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.EventoUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_EventoUnidade_Unidade");
        });

        modelBuilder.Entity<FaturaTitulo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FaturaTi__3214EC0788C85F1E");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTituloNavigation).WithMany(p => p.FaturaTitulo)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Titulo_FaturaTitulo");
        });

        modelBuilder.Entity<FaturaTituloPagar>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FaturaTi__3214EC075474774E");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdTituloPagarNavigation).WithMany(p => p.FaturaTituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloPagar_FaturaTituloPagar");
        });

        modelBuilder.Entity<FormaPagamento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__FormaPag__3214EC07215A19F0");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");
        });

        modelBuilder.Entity<Fornecedor>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Forneced__3214EC075FEF6842");

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
            entity.Property(e => e.Status).HasDefaultValueSql("((1))");

            entity.HasOne(d => d.IdCategoriaImovelNavigation).WithMany(p => p.Imovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_CategoriaImovel_Imovel");

            entity.HasOne(d => d.IdClienteProprietarioNavigation).WithMany(p => p.Imovel).HasConstraintName("fk_Cliente_ClienteProprietario");
        });

        modelBuilder.Entity<ImovelEndereco>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__ImovelEn__3214EC071374D299");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.ImovelEndereco)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_ImovelEndereco_Imovel");
        });

        modelBuilder.Entity<IndiceReajuste>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__IndiceRe__3214EC071AB2F649");
        });

        modelBuilder.Entity<Obra>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Obra__3214EC0706C7315A");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.Obra)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_Imovel_Obra");
        });

        modelBuilder.Entity<ObraServico>(entity =>
        {
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.GuidReferencia).HasDefaultValueSql("(newid())");

            entity.HasOne(d => d.IdObraNavigation).WithMany(p => p.ObraServico)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ObraServico_Obra");
        });

        modelBuilder.Entity<ObraUnidade>(entity =>
        {
            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdObraNavigation).WithMany(p => p.ObraUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ObraUnidade_Obra");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.ObraUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK_ObraUnidade_Unidade");
        });

        modelBuilder.Entity<TipoCliente>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoClie__3214EC07050398E1");
        });

        modelBuilder.Entity<TipoContrato>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoCont__3214EC0702C3BC07");
        });

        modelBuilder.Entity<TipoCreditoAluguel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoCred__3214EC077E51072D");
        });

        modelBuilder.Entity<TipoDespesa>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoDesp__3214EC07C49112F9");
        });

        modelBuilder.Entity<TipoEvento>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoEven__3214EC0768AA466C");
        });

        modelBuilder.Entity<TipoServico>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoServ__3214EC07FF4795B4");
        });

        modelBuilder.Entity<TipoTitulo>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoTitu__3214EC0750F205A8");
        });

        modelBuilder.Entity<TipoUnidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TipoUnid__3214EC074849F14B");
        });

        modelBuilder.Entity<TituloImovel>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloIm__3214EC078A5A4EA8");

            entity.HasOne(d => d.IdImovelNavigation).WithMany(p => p.TituloImovel)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloImovel_Imovel");

            entity.HasOne(d => d.IdTituloPagarNavigation).WithMany(p => p.TituloImovel).HasConstraintName("fk_TituloImovel_TituloPagar");

            entity.HasOne(d => d.IdTituloReceberNavigation).WithMany(p => p.TituloImovel).HasConstraintName("fk_TituloImovel_TituloReceber");
        });

        modelBuilder.Entity<TituloPagar>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloPa__3214EC07B65BCCDF");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.TituloPagar).HasConstraintName("fk_Cliente_TituloPagar");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.TituloPagar).HasConstraintName("fk_ContratoAluguel_TituloPagar");

            entity.HasOne(d => d.IdFormaPagamentoNavigation).WithMany(p => p.TituloPagar).HasConstraintName("fk_FormaPagamento_TituloPagar");

            entity.HasOne(d => d.IdIndiceReajusteNavigation).WithMany(p => p.TituloPagar).HasConstraintName("fk_IndiceReajuste_TituloPagar");

            entity.HasOne(d => d.IdTipoCreditoAluguelNavigation).WithMany(p => p.TituloPagar).HasConstraintName("fk_TipoCreditoAluguel_TituloPagar");

            entity.HasOne(d => d.IdTipoTituloNavigation).WithMany(p => p.TituloPagar)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoTitulo_TituloPagar");
        });

        modelBuilder.Entity<TituloReceber>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloRe__3214EC07150EA9CE");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.IdClienteNavigation).WithMany(p => p.TituloReceber).HasConstraintName("fk_Cliente_TituloReceber");

            entity.HasOne(d => d.IdContratoAluguelNavigation).WithMany(p => p.TituloReceber).HasConstraintName("fk_ContratoAluguel_TituloReceber");

            entity.HasOne(d => d.IdFormaPagamentoNavigation).WithMany(p => p.TituloReceber).HasConstraintName("fk_FormaPagamento_TituloReceber");

            entity.HasOne(d => d.IdIndiceReajusteNavigation).WithMany(p => p.TituloReceber).HasConstraintName("fk_IndiceReajuste_TituloReceber");

            entity.HasOne(d => d.IdTipoCreditoAluguelNavigation).WithMany(p => p.TituloReceber).HasConstraintName("fk_TipoCreditoAluguel_TituloReceber");

            entity.HasOne(d => d.IdTipoTituloNavigation).WithMany(p => p.TituloReceber)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TipoTitulo_Titulo");
        });

        modelBuilder.Entity<TituloUnidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__TituloUn__3214EC07F7415533");

            entity.HasOne(d => d.IdTituloImovelNavigation).WithMany(p => p.TituloUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloUnidade_TituloImovel");

            entity.HasOne(d => d.IdUnidadeNavigation).WithMany(p => p.TituloUnidade)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("fk_TituloUnidade_Unidade");
        });

        modelBuilder.Entity<Unidade>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("PK__Unidade__3214EC075A1ECD2B");

            entity.Property(e => e.DataCriacao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.Status).HasDefaultValueSql("((1))");

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
