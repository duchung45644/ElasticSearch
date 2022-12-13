using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Repository;

namespace WebApi.Services
{
    public interface IUserService
    {
        User Login(User model);
        List<RightModel> GetRight(int userId );
        List<ActionModel> GetAction(int userId);
        //List<AssetsUnitsModel> GetAssets(int userId);
        Response ResetPassword(User model);
        IEnumerable<RegistrasionlistModel> GetAllStaff();
        IEnumerable<RegistrasionlistModel> GetAllstaffRenewalprofile();
    }

    public class UserService : IUserService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public UserService(ICommonRepository respository)
        {
            _respository = respository;
        }

        public Response ResetPassword(User model)
        {
            string sql = String.Format(@"UPDATE acc.[User] SET Password = N'{1}' WHERE UserId = {0}",
                model.UserId, model.Password.ComputeSha256Hash());

            return _respository.ExcuteSql(sql);
        }
        
        public User Login(User model)
        {
            var arg = new
            {
                model.UserName,
                Password = model.Password.ComputeSha256Hash()
            };
            return _respository.GetObjectByStore<User>("[acc].[Proc_User_Login]", arg);
        }

        public List<RightModel> GetRight(int userId )
        {
            var arg = new
            {
                UserId = userId,
                
            };
            var rights = _respository.GetListByStore<RightModel>("acc.[Prc_RightGetByStaffId]", arg);
            return rights;
        }
        public List<ActionModel> GetAction(int userId)
        {
            var arg = new
            {
                UserId = userId,
            };
            var rights = _respository.GetListByStore<ActionModel>("[acc].[Proc_User_GetAction]", arg);
            return rights;
        }
   
        public IEnumerable<RegistrasionlistModel> GetAllStaff()
        {
            var lst = _respository.GetListByStore<RegistrasionlistModel>("esto.[Prc_GetRegistrasionlistStaff]");

            return lst;
        }

        public IEnumerable<RegistrasionlistModel> GetAllstaffRenewalprofile()
        {
            var lst = _respository.GetListByStore<RegistrasionlistModel>("esto.[Prc_GetRenewalprofileStaff]");

            return lst;
        }
        //public List<AssetsUnitsModel> GetAssets(int userId)
        //{
        //    var arg = new
        //    {
        //        UserId = userId,

        //    };
        //    var rights = _respository.GetListByStore<AssetsUnitsModel>("[acc].[Proc_User_GetAssets]", arg);
        //    return rights;
        //}
    }
}