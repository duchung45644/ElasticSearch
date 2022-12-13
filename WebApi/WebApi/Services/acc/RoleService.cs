using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using WebApi.Models;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IRoleService
    {
        IEnumerable<RoleModel> GetAllRole(int unitId);
        Response Create(RoleModel entry);
        RoleModel GetRoleById(int id);
        Response Update(RoleModel entry);
        Response Delete(int id);
        IEnumerable<ActionModel> GetActionByRoleId(int roleId, int unitId);
        IEnumerable<ActionModel> GetUnitByRoleId(int unitId);

    }
    public class RoleService : IRoleService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public RoleService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<RoleModel> GetAllRole(int unitId)
        {
            var roles = _respository.GetListByStore<RoleModel>("acc.[Prc_RoleGetAll]", new {Unitid=  unitId });

            return roles;
        }
 
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public RoleModel GetRoleById(int id)
        {
            return _respository.GetObjectByStore<RoleModel>("[acc].Prc_RoleGetById", new { Id =id });
        }
        public IEnumerable<ActionModel> GetActionByRoleId(int roleId,int unitId)
        {
            return _respository.GetListByStore<ActionModel>("[acc].[Prc_ActionOfUnitForRole]", new {
                UnitId =unitId,
                RoleId =roleId
            });
        }

        

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(RoleModel model)
        {
            var InsertedActions = string.Join(",", model.InsertedActions);
            var arg = new
            {
                Name = model.Name,
                Description = model.Description,
                IsLocked =model.IsLocked,
                CreatedUserId = model.CreatedUserId,
                UnitId = model.UnitId,
                InsertedActions= InsertedActions
            };
            var response = _respository.GetObjectByStore<Response>("[acc].[Prc_RoleInsert]",  arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(RoleModel model)
        {
            var InsertedActions = string.Join(",", model.InsertedActions);
            var arg = new
            {
                Id = model.Id,
                Name = model.Name,
                Description = model.Description,
                IsLocked = model.IsLocked,
                CreatedUserId = model.CreatedUserId,
                UnitId = model.UnitId,
                InsertedActions = InsertedActions
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_RoleUpdate]", arg);
            return response;
        }

        /// <summary>
        /// Delete the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Delete(int id)
        {
            var arg = new
            {
              Id= id
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_RoleDelete]", arg);
            return response;
        }
        public IEnumerable<ActionModel> GetUnitByRoleId(int unitId)
        {
            return _respository.GetListByStore<ActionModel>("[acc].[Prc_UserGetById]", new
            {
                UnitId = unitId,
            });
        }

    }
}

