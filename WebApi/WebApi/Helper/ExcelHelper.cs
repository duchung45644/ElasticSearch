using ClosedXML.Excel;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace WebApi.Helper
{
    public class ExcelHelper
    {
        public static DataTable ReadToTable(MemoryStream ms, int startRow, int headRow)
        {
            DataTable dt = new DataTable();

            using (var workbook = new XLWorkbook(ms))
            {
                IXLWorksheet worksheet = workbook.Worksheet(1);
                //Range for reading the cells based on the last cell used.  
                string readRange = "1:1";
                IXLRows rows = worksheet.Rows(headRow, headRow);
                foreach (var row in rows)
                {
                    readRange = string.Format("{0}:{1}", 1, row.LastCellUsed().Address.ColumnNumber);
                    foreach (IXLCell cell in row.Cells(readRange))
                    {

                        dt.Columns.Add(cell.Value.ToString());
                    }
                }

                IXLRows rowsValues = worksheet.Rows(startRow, worksheet.LastRowUsed().FirstCellUsed().Address.RowNumber);
                foreach (var row in rowsValues)
                {
                    dt.Rows.Add();
                    int cellIndex = 0;
                    //Updating the values of datatable  
                    foreach (IXLCell cell in row.Cells(readRange))
                    {
                        dt.Rows[dt.Rows.Count - 1][cellIndex] = cell.Value.ToString();
                        cellIndex++;
                    }
                }
            }
            return dt;
        }
    }
}
