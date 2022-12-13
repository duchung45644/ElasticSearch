using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface ICommonService
    {
        T GetObjectByStore<T>(string storeName, object obj) where T : class;
        List<T> GetListByStore<T>(string storeName, object obj) where T : class;
        T GetObjectBySqlQuery<T>(string sql);
        List<T> GetListBySqlQuery<T>(string sql);
        Tuple<IList<T1>, IList<T2>> GetListBySqlQuery<T1, T2>(string sql);
    }
    public class CommonService : ICommonService
    {
        private readonly ICommonRepository _respository;
        public CommonService(string connectString)
            : this(new CommonRepository(connectString))
        {
        }
        public CommonService(ICommonRepository respository)
        {
            _respository = respository;
        }

        public List<T> GetListBySqlQuery<T>(string sql)
        {
            return _respository.GetListBySqlQuery<T>(sql);
        }

        public Tuple<IList<T1>, IList<T2>> GetListBySqlQuery<T1, T2>(string sql)
        {
            return _respository.GetListBySqlQuery<T1, T2>(sql);
        }

        public List<T> GetListByStore<T>(string storeName, object obj) where T : class
        {
            return _respository.GetListByStore<T>(storeName, obj);
        }

        public T GetObjectBySqlQuery<T>(string sql)
        {
            return _respository.GetObjectBySqlQuery<T>(sql);
        }

        public T GetObjectByStore<T>(string storeName, object obj) where T : class
        {
            return _respository.GetObjectByStore<T>(storeName, obj);
        }
    }
}
