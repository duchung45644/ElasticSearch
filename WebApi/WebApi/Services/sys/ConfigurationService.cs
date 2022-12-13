using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IConfigurationService
    {
        IEnumerable<ConfigurationModel> GetAllConfiguration();
        Response Create(ConfigurationModel entry);
        ConfigurationModel GetConfigurationById(int id);
        Response Update(ConfigurationModel entry);
        Response Delete(int id);
    }
    public class ConfigurationService : IConfigurationService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;
        public ConfigurationService(ICommonRepository respository)
        {
            _respository = respository; 
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<ConfigurationModel> GetAllConfiguration()
        {
            var configs = _respository.GetListByStore<ConfigurationModel>("[dbo].[Prc_ConfigurationGetAll]", new { });

            return configs;
        }
     

        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public ConfigurationModel GetConfigurationById(int id)
        {
            return _respository.GetObjectByStore<ConfigurationModel>("[acc].Prc_ConfigurationGetById", new { Id =id });
        }

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(ConfigurationModel deparment)
        {
            var arg = new
            {
                 
            };
            var response = _respository.GetObjectByStore<Response>("[acc].[Prc_ConfigurationInsert]",  arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(ConfigurationModel deparment)
        {
            var arg = new
            {
               
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_ConfigurationUpdate]", arg);
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
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_ConfigurationDelete]", arg);
            return response;
        }

    }
}

