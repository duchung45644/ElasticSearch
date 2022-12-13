using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi
{
    public class AppConfiguration
    {
        private readonly IConfiguration Config;
        public AppConfiguration(IConfiguration configuration)
        {
            Config = configuration.GetSection("AppConfiguration");
        }

        public string JWT_Secret
        {
            get
            {
                return Config["JWT_Secret"].ToString();
            }

        }

        public string DefaultPassword
        {
            get
            {
                return Config["DefaultPassword"].ToString();
            }

        }
        public int PageSize
        {
            get
            {
                return Convert.ToInt32(Config["PageSize"]);
            }
            
        }
        public string ExcelDocof
        {
            get
            {
                return Config["Templates:Baocaoi"].ToString();
            }
        }
        public int CacheInMinutes
        {
            get
            {
                return Convert.ToInt32(Config["CacheInMinutes"]);
            }

        }
        
        public string ExcelReportInventory
        {
            get
            {
                return Config["Templates:ExcelReportInventory"].ToString();
            }

        }
        public string ExcelMonitor
        {
            get
            {
                return Config["Templates:Baocaoquanlytruycap"].ToString();
            }

        }
        public string ExcelResult
        {
            get
            {
                return Config["Templates:Baocaoquanlyketquagiaiquyet"].ToString();
            }

        }

        public string ExcelReportAssets
        {
            get
            {
                return Config["Templates:ExcelReportAssets"].ToString();
            }

        }

        public string ExcelAssetsReport
        {
            get
            {
                return Config["Templates:Baocaothongketaisan"].ToString();
            }

        }

        public string ExcelReportAssetsUnits
        {
            get
            {
                return Config["Templates:ExcelReportAssetsUnits"].ToString();
            }

        }

        public string ReportUnitSendDocumentDetail
        {
            get
            {
                return Config["Templates:ReportUnitSendDocumentDetail"].ToString();
            }

        }
        public string ReportUnitAssigningTemplate
        {
            get
            {
                return Config["Templates:ReportUnitAssigningTemplate"].ToString();
            }

        }
        public string ReportUnitAssigningDetailTemplate
        {
            get
            {
                return Config["Templates:ReportUnitAssigningDetailTemplate"].ToString();
            }

        }
        public string ReportUnitInChargeTemplate
        {
            get
            {
                return Config["Templates:ReportUnitInChargeTemplate"].ToString();
            }

        }
        public string ReportUnitInChargeDetailTemplate
        {
            get
            {
                return Config["Templates:ReportUnitInChargeDetailTemplate"].ToString();
            }

        }
        public string ReportHandlingDocStep
        {
            get
            {
                return Config["Templates:ReportHandlingDocStep"].ToString();
            }

        }
        public string ReportMonitoringTemplate
        {
            get
            {
                return Config["Templates:ReportMonitoringTemplate"].ToString();
            }

        }
        public string LogFolderFilePath
        {
            get
            {
                return Config["LogFolderFilePath"];
            }

        }
        public string LogBookBorrowedTemplate
        {
            get
            {
                return Config["Templates:Sotheodoitailieumuon"].ToString();
            }

        }

    }
}
