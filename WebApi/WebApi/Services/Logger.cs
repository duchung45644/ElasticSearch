using Microsoft.Extensions.Configuration;
using System;
using WebApi.Models;
using WebApi.Repository;

namespace WebApi.Services
{
    public static class Logger
    {
          
        public static void LogError(Exception e, string pageName)
        { 
            var connectString = Startup.StaticConfig.GetConnectionString("Default");
             

            var sql = @"INSERT INTO [dbo].[Log]
           ( [ErrorMessage]
           ,[ErrorDateTime]
           ,[ObjectError]
           ,[InnerException]
           ,[ErrorStackTrace]
           ,[ErrorCode])
     VALUES
           ( @ErrorMessage
           ,GetDate()
           ,@ObjectError
           ,@InnerException
           ,@ErrorStackTrace
           ,@ErrorCode)";
            try
            {
                var common = new CommonRepository(connectString);
                common.ExcuteSqlQuery(sql,
                    new
                    {
                        ErrorMessage = e.Message,
                        ObjectError = pageName,
                        InnerException = e.InnerException != null ? e.InnerException.ToString() : "",
                        ErrorStackTrace = e.StackTrace,
                        ErrorCode = "ErrorCode"
                    });
            }
            catch (Exception ex)
            {
            }
        }
        public static void LogMonitor(MonitorModel model)
        {
            var connectString = Startup.StaticConfig.GetConnectionString("Default");

            var sql = @"
            INSERT dbo.Monitor
            (
                Type,
                AccessDate,
                UserId,
                IP,
                Description,
                Object
            )
            VALUES
            (   
                @Type,
                GETDATE(),
                @UserId,
                @IP,
                @Description,
                @Object
                )
";
            try
            {
                var common = new CommonRepository(connectString);
                common.ExcuteSqlQuery(sql,
                    new
                    {
                    model.Type,
                    model.UserId,
                    model.Ip,
                    model.Description,
                    model.Object
                    });
            }
            catch (Exception ex)
            {
                LogError(ex, "LogMonitor");
            }
        }
    }
}

