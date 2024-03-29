﻿using IrisGestao.Domain.Command.Result;
using IrisGestao.Domain.Entity;

namespace IrisGestao.ApplicationService.Repository.Interfaces;

public interface IAnexoRepository : IRepository<Anexo>, IDisposable
{
    Task<IEnumerable<Anexo>> GetByGuid(Guid uuid);
    Task<IEnumerable<Anexo>> GetByClassificacao(Guid uuid, string classificacao);
}