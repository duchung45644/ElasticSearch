using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using WebApi.Models;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IRightService
    {
        IEnumerable<RightModel> GetAllRight();
        Response Create(RightModel entry);
        RightModel GetRightById(int id);
        Response Update(RightModel entry);
        Response Delete(int id);
        List<RightModel> GetActiveRight();
        IEnumerable<ActionModel> GetActionByRightId(int id);
    }
    public class RightService : IRightService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public RightService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<RightModel> GetAllRight()
        {
            var rights = _respository.GetListByStore<RightModel>("acc.[Prc_RightGetAll]", new { });

            return rights;
        }
 
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        /// 

        public RightModel GetRightById(int id)
        {
            return _respository.GetObjectByStore<RightModel>("[acc].Prc_RightGetById", new { Id =id });
        }
        public IEnumerable<ActionModel> GetActionByRightId(int id)
        {
            return _respository.GetListByStore<ActionModel>("acc.[Prc_ActionGetByRightId]", new { Id = id });
        }

        

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(RightModel entry)
        {
            var actions = new XElement("Actions",
              entry.ListAction.Select(i => new XElement("Action",
                  new XElement("Id", i.Id),
                  new XElement("Code", i.Code),
                  new XElement("Name", i.Name)
                  )));
            var arg = new
            {
                entry.Name,
                entry.NameOfMenu,
                entry.ShowMenu,
                entry.DefaultPage,
                entry.Image,
                entry.SortOrder,
                entry.Description,
                entry.IsLocked,
                entry.ActionLink,
                entry.ParentId,
                ListAction = actions.ToString()
            };
            var response = _respository.GetObjectByStore<Response>("[acc].[Prc_RightInsert]",  arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(RightModel entry)
        {
            var actions = new XElement("Actions",
                entry.ListAction.Select(i => new XElement("Action",
                    new XElement("Id", i.Id),
                    new XElement("Code", i.Code),
                    new XElement("Name", i.Name)
                    )));
            var arg = new
            {
                 entry.Id,
                entry.Name,
                entry.NameOfMenu,
                entry.ShowMenu,
                entry.DefaultPage,
                entry.Image,
                entry.SortOrder,
                entry.Description,
                entry.IsLocked,
                entry.ActionLink,
                entry.ParentId,
                ListAction = actions.ToString()
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_RightUpdate]", arg);
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
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_RightDelete]", arg);
            return response;
        }

        public List<RightModel> GetActiveRight()
        {
            var response = _respository.GetListBySqlQuery<RightModel, ActionModel>("[acc].[Prc_RightGetActive]");
            var rights = response.Item1.ToList();
            foreach (var r in rights)
            {
                r.ListAction = response.Item2.Where(X => X.RightId == r.Id).ToList();
            }
            return rights;
        }

    }
}

