using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Reflection;
using System.Transactions;
using WebApi.Models;

namespace WebApi.Repository
{

    public interface ICommonRepository
    {
        List<T> GetListBySqlQuery<T>(string sql, object obj = null);
        T GetObjectBySqlQuery<T>(string sql, object obj = null);
        Tuple<IList<T1>, IList<T2>> GetListBySqlQuery<T1, T2>(string sql, object obj = null);
        Response ExcuteSql(string sql);
        bool ExcuteSqlQuery(string sql, object item);
        object ExcuteSqlQueryGetValueV2(string sql, object obj);
        object ExcuteStoreGetValueV2(string storeName, object obj);

        Response ExcuteStore(string storeName, object obj);
        List<T> GetListByStore<T>(string storeName, object obj =null);
        Tuple<IList<T1>, IList<T2>> GetListByStore<T1, T2>(string storeName, object obj = null);
        T GetObjectByStore<T>(string storeName, object obj);

        void WithTransaction(Func<Response> func);
    }
    public class CommonRepository : ICommonRepository
    {
        private string _connectString;
        private System.Int32 _timeOut = 240;
        // private readonly String LogFolderFilePath;
        /// <summary>
        /// Initializes a new instance of the <see cref="Repository"/> class.
        /// </summary>
        /// <param name="database">The database.</param>
        public CommonRepository(IConfiguration configuration)
        {
            _connectString = configuration.GetConnectionString("Default");
            //LogFolderFilePath = configuration["Config:LogFolderFilePath"];

        }

        public CommonRepository(string connectString)
        {
            _connectString = connectString;
        }

        //public CommonRepository(Database database)
        //{
        //    _connectString = database.Get();
        //}

        public List<T> GetListBySqlQuery<T>(string sql, object obj = null)
        {
            List<T> items;
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(sql, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.Text;
                    if (obj != null)
                    {

                        foreach (PropertyInfo p in obj.GetType().GetProperties())
                        {
                            var val = p.GetValue(obj, null);
                            command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                        }
                    }
                    var reader = command.ExecuteReader();
                    items = reader.MapToList<T>();
                    reader.Dispose();
                    reader.Close();
                }
                catch (SqlException exception)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return items;
        }
        public Tuple<IList<T1>, IList<T2>> GetListBySqlQuery<T1, T2>(string sql, object obj = null)
        {
            Tuple<IList<T1>, IList<T2>> items;
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(sql, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.Text;
                    if (obj != null)
                    {

                        foreach (PropertyInfo p in obj.GetType().GetProperties())
                        {
                            var val = p.GetValue(obj, null);
                            command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                        }
                    }
                    var reader = command.ExecuteReader();

                    var instanse1 = reader.MapToList<T1>();
                    reader.NextResult();
                    var instanse2 = reader.MapToList<T2>();

                    reader.Dispose();
                    reader.Close();
                    items = new Tuple<IList<T1>, IList<T2>>(instanse1, instanse2);
                }
                catch (SqlException exception)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return items;
        }

        public T GetObjectBySqlQuery<T>(string sql, object obj = null)
        {
            var items = new List<T>();
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(sql, connection))
            {
                connection.Open();
                try
                {
                    if (obj != null)
                    {

                        foreach (PropertyInfo p in obj.GetType().GetProperties())
                        {
                            var val = p.GetValue(obj, null);
                            command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                        }
                    }
                    command.CommandType = CommandType.Text;
                    var reader = command.ExecuteReader();
                    items = reader.MapToList<T>();

                    reader.Dispose();
                    reader.Close();
                }
                catch (SqlException exception)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            if (items.Any()) return items.FirstOrDefault();
            return default(T);
        }

        public Response ExcuteSql(string sql)
        {
            var response = new Response
            {
                Success = true,
                Message = ""
            };
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(sql, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.Text;
                    response.RowsAffected = command.ExecuteNonQuery();
                    response.Success = true;
                }
                catch (SqlException exception)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return response;
        }

        public bool ExcuteSqlQuery(string sql, object obj)
        {
            int rowsAffected = 0;
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(sql, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.Text;
                    foreach (PropertyInfo p in obj.GetType().GetProperties())
                    {
                        var val = p.GetValue(obj, null);
                        command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                    }
                    rowsAffected = command.ExecuteNonQuery();

                }
                catch (SqlException exception)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return rowsAffected != 0;
        }
        public object ExcuteSqlQueryGetValueV2(string sql, object obj)
        {
            object item = null;
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(sql, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.Text;
                    foreach (PropertyInfo p in obj.GetType().GetProperties())
                    {
                        var val = p.GetValue(obj, null);
                        command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                    }
                    var reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        item = reader[0];
                    }
                    reader.Dispose();
                    reader.Close();
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return item;
        }
        public object ExcuteStoreGetValueV2(string storeName, object obj)
        {
            object item = null;
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(storeName, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.StoredProcedure;
                    foreach (PropertyInfo p in obj.GetType().GetProperties())
                    {
                        var val = p.GetValue(obj, null);
                        command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                    }
                    var reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        item = reader[0];
                    }
                    reader.Dispose();
                    reader.Close();
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return item;
        }

        public Response ExcuteStore(string storeName, object obj)
        {
            var response = new Response
            {
                Success = true,
                Message = "",
                RowsAffected = 0
            };
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(storeName, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.StoredProcedure;
                    foreach (PropertyInfo p in obj.GetType().GetProperties())
                    {
                        var val = p.GetValue(obj, null);
                        command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                    }
                    response.RowsAffected = command.ExecuteNonQuery();
                    response.Success = true;
                }
                catch (SqlException exception)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return response;
        }

        public List<T> GetListByStore<T>(string storeName, object obj = null)
        {
            var items = new List<T>();
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(storeName, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (obj != null)
                    {
                        foreach (PropertyInfo p in obj.GetType().GetProperties())
                        {
                            var val = p.GetValue(obj, null);
                            command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                        }
                    }
                    
                    var reader = command.ExecuteReader();
                    items = reader.MapToList<T>();
                    reader.Dispose();
                    reader.Close();
                }
                catch (Exception e)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return items;
        }
        public Tuple<IList<T1>, IList<T2>> GetListByStore<T1,T2>(string storeName, object obj = null)
        {
            Tuple<IList<T1>, IList<T2>> items;
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(storeName, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.StoredProcedure;
                    if (obj != null)
                    {
                        foreach (PropertyInfo p in obj.GetType().GetProperties())
                        {
                            var val = p.GetValue(obj, null);
                            command.Parameters.AddWithValue("@" + p.Name, (val == null || val.ToString().Length == 0) ? DBNull.Value : val);
                        }
                    }
                    var reader = command.ExecuteReader();

                    var instanse1 = reader.MapToList<T1>();
                    reader.NextResult();
                    var instanse2 = reader.MapToList<T2>();

                    reader.Dispose();
                    reader.Close();
                    items = new Tuple<IList<T1>, IList<T2>>(instanse1, instanse2);

                }
                catch (Exception e)
                {
                    throw;
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return items;
        }
        public T GetObjectByStore<T>(string storeName, object obj)
        {
            var items = GetListByStore<T>(storeName, obj);
            return items.Any() ? items.FirstOrDefault() : default(T);
        }
        public object GetValueByKey(string storeName, string keyName, params KeyValuePair<string, object>[] parameters)
        {
            object item = null;
            using (var connection = new SqlConnection(_connectString))
            using (var command = new SqlCommand(storeName, connection))
            {
                connection.Open();
                try
                {
                    command.CommandType = CommandType.StoredProcedure;
                    foreach (var p in parameters)
                    {
                        command.Parameters.AddWithValue(p.Key,
                            (p.Value == null || p.Value.ToString().Length == 0) ? DBNull.Value : p.Value);
                    }
                    var reader = command.ExecuteReader();

                    while (reader.Read())
                    {
                        item = reader[keyName];
                    }
                    reader.Dispose();
                    reader.Close();
                }
                catch (SqlException ex)
                {
                    throw new Exception(ex.Message);
                }
                finally
                {
                    command.Dispose();
                    connection.Dispose();
                    connection.Close();
                }
            }
            return item;
        }


        ///// <summary>
        ///// Gets the table schema.
        ///// </summary>
        ///// <param name="type">The type.</param>
        ///// <returns></returns>
        //private string GetTableSchema(Type type)
        //{
        //    string name = "";
        //    var tableattr =
        //        type.GetCustomAttributes(false).SingleOrDefault(attr => attr.GetType().Name == "TableSchemaAttribute")
        //            as
        //            dynamic;
        //    if (tableattr != null) name = tableattr.Name + ".";

        //    return name;
        //}

        ///// <summary>
        ///// Gets the name of the table.
        ///// </summary>
        ///// <param name="type">The type.</param>
        ///// <returns></returns>
        //private static string GetTableName(Type type)
        //{
        //    var tableattr =
        //        type.GetCustomAttributes(false).SingleOrDefault(attr => attr.GetType().Name == "TableNameAttribute") as
        //            dynamic;
        //    string name = tableattr != null ? tableattr.Name : type.Name;

        //    return name;
        //}

        /// <summary>
        /// Withes the transaction.
        /// </summary>
        /// <param name="func">The function.</param>
        public void WithTransaction(Func<Response> func)
        {
            using (var tran = new TransactionScope())
            {
                func();
                tran.Complete();
            }
        }
    }
}
