
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IDashboardService
    {
        DashboardModel GetDashboard(int UnitId);
    }
    public class DashboardService : IDashboardService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;
        public DashboardService(ICommonRepository respository)
        {
            _respository = respository; 
        }
         
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public DashboardModel GetDashboard(int UnitId)
        {

            var data = new DashboardModel();

            data.Stats = _respository.GetListByStore<DashboardData>("[dbo].Prc_Dashboard_GetCountByStatus", new { UnitId = UnitId});
            data.DataByCategories = _respository.GetListByStore<DashboardData>("[dbo].Prc_Dashboard_GetCountByCategory", new { UnitId = UnitId });
            data.DataByFamCates = _respository.GetListByStore<DashboardData>("[dbo].Prc_Dashboard_GetCountByFamCate", new { UnitId = UnitId });
            data.DataLineChart = _respository.GetListByStore<DashboardData>("[dbo].Prc_Dashboard_GetCountLineChart", new { UnitId = UnitId });
            return data;
        }

    }
}

