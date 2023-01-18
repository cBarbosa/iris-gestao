using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IrisGestao.Domain.Emuns
{
    public static class ErrorResponseEnums
    {
        public static string Error_1000 = "Não foi possível salvar esse registro";
        public static string Error_1001 = "Não foi possível alterar esse registro";
        public static string Error_1002 = "Não foi possível excluir esse registro";
        public static string Error_1003 = "Dados não validados";
        public static string Error_1004 = "Email não foi enviados";
        public static string Error_1005 = "Falha ao carregados Dados";
        public static string Error_1006 = "Para realizar essa operação é preciso informar o código";
        public static string Error_1007 = "Não é possível cadastrar o cliente, já existe um cadastro com esse CPF/CNPJ";
    }

    public static class SuccessResponseEnums
    {
        public static string Success_1000 = "Dados cadastrado com sucesso";
        public static string Success_1001 = "Dados alterados com sucesso";
        public static string Success_1002 = "Dados excluídos com sucesso";
        public static string Success_1003 = "Informações validadas com sucesso";
        public static string Success_1004 = "Email enviado com sucesso";
        public static string Success_1005 = "Dados carregados com sucesso";
    }
}