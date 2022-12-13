using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IDepartmentService
    {
        /// <summary>
        /// Lấy toàn bộ 
        /// </summary>
        /// <returns></returns>
        IEnumerable<DepartmentModel> GetAllDepartment();
   
        /// <summary>
        /// Lấy toàn bộ root là UNIT ID
        /// </summary>
        /// <returns></returns>
        IEnumerable<DepartmentModel> GetAllDepartmentByUnitId(int id);
        Response Create(DepartmentModel entry);
        DepartmentModel GetDepartmentById(int id);
        Response Update(DepartmentModel entry);
        Response Delete(int id);
        IEnumerable<ActionModel> GetActionByUnitId(int id);
        Response SaveActionOfUnit(DepartmentModel model);
    }
    public class DepartmentService : IDepartmentService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public DepartmentService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<DepartmentModel> GetAllDepartment()
        {
            var departments = _respository.GetListByStore<DepartmentModel>("acc.[Prc_DepartmentGetAll]", new { });

            return departments;
        }

 

        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
          public DepartmentModel GetDepartmentById(int id)
        {
            return _respository.GetObjectByStore<DepartmentModel>("[acc].Prc_DepartmentGetById   ", new { Id = id });
        }      /// <author>Louis</author>


        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(DepartmentModel deparment)
        {
            var arg = new
            {
                deparment.Code,
                deparment.Password,
                deparment.DocCode,
                deparment.ConsummerKey,
                deparment.ConsummerSecret,
                deparment.AbbName,
                deparment.ShortName,
                deparment.Name,
                deparment.ParentId,
                deparment.IsUnit,
                deparment.SortOrder,
                deparment.AllowDocBook,
                deparment.Level,
                deparment.Description,
                deparment.IsLocked,
                deparment.CreatedUserId
            };
            var response = _respository.GetObjectByStore<Response>("[acc].[Prc_DepartmentInsert]", arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(DepartmentModel deparment)
        {
            var arg = new
            {
                deparment.Id,
                deparment.Code,
                deparment.Password,
                deparment.DocCode,
                deparment.ConsummerKey,
                deparment.ConsummerSecret,
                deparment.AbbName,
                deparment.ShortName,
                deparment.Name,
                deparment.ParentId,
                deparment.IsUnit,
                deparment.SortOrder,
                deparment.AllowDocBook,
                deparment.Level,
                deparment.Description,
                deparment.IsLocked,
                deparment.ModifiedUserId
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_DepartmentUpdate]", arg);
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
                Id = id
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_DepartmentDelete]", arg);
            return response;
        }

        public IEnumerable<ActionModel> GetActionByUnitId(int id)
        {
            var actions = _respository.GetListByStore<ActionModel>("[acc].[Prc_ActionOfUnitGetByUnitId]", new { UnitId = id });

            return actions;
        }

        public Response SaveActionOfUnit(DepartmentModel model)
        {
            var arg = new
            {
                model.Id,
                InsertedActions = string.Join(",", model.InsertedActions),
            };
            var response = _respository.GetObjectByStore<Response>("[acc].[Prc_ActionOfUnitSaveForUnitID]", arg);
            return response;
        }

        public IEnumerable<DepartmentModel> GetAllDepartmentByUnitId(int id)
        {
            var departments = _respository.GetListByStore<DepartmentModel>("[acc].[Prc_DepartmentGetByUnitId]", new { UnitId = id });

            return departments;
        }
    }
}

