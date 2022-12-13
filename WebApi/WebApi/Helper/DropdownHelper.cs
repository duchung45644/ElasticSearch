using System.Collections.Generic;
using System.Linq;
using WebApi.Models;

namespace WebApi.Helper
{

    public class DropDownlistObjModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public bool Selected { get; set; }
    }

    public static class DropdownHelper
    {
        

        private static List<DropDownlistObjModel> BuildChildrenDeparment(List<DropDownlistObjModel> dropDownlists, List<DepartmentModel> departments, int departmentId, string prefix)
        {
            foreach (var department in departments.OrderBy(x => x.Level).ThenBy(x => x.SortOrder).Where(x => x.ParentId == departmentId))
            {
                var existing = departments.Count(x => x.ParentId == department.Id) > 0;
                var node = new DropDownlistObjModel
                {
                    Id = department.Id,
                    Name = $"{prefix} {department.Name}"
                   
                };

                dropDownlists.Add(node);
                if (existing)
                {
                    dropDownlists = BuildChildrenDeparment(dropDownlists, departments, department.Id, $"{prefix} --");
                }
            }
            return dropDownlists;
        }
        public static List<DropDownlistObjModel> BuildDepartmentDropdown(List<DepartmentModel> input, int id)
        {
            var dropDownlists = new List<DropDownlistObjModel>();
            input = input.OrderBy(x => x.Level).ThenBy(x => x.SortOrder).ToList();
            foreach (var department in input.Where(x => x.Id == id))
            {
                var existing = input.Count(x => x.ParentId == department.Id) > 0;
                var node = new DropDownlistObjModel
                {
                    Id = department.Id,
                    Name = department.Name,
                };
                dropDownlists.Add(node);
                if (existing)
                {
                    dropDownlists = BuildChildrenDeparment(dropDownlists, input, department.Id, "--");
                }
            }

            return dropDownlists;
        }
     
        private static List<RightModel> BuildChildrenRight(ref List<RightModel> dropDownlists,
            List<RightModel> rights, long rid, string prefix)
        {
            foreach (var right in rights.Where(x => x.ParentId == rid))
            {
                var existing = rights.Count(x => x.ParentId == right.Id) > 0;
                right.Name = $"{prefix} {right.Name}";
                dropDownlists.Add(right);
                if (existing)
                {
                    dropDownlists = BuildChildrenRight(ref dropDownlists, rights, right.Id, $"{prefix}--");
                }
            }
            return dropDownlists;
        }

        /// <summary>Builds the unit assigning.</summary>
        /// <param name="rights">The input.</param>
        /// <returns></returns>
        public static List<RightModel> BuildTreeRight(List<RightModel> rights, int parentid)
        {
            var dropDownlists = new List<RightModel>();
            if (rights == null)
            {

                return dropDownlists;
            }
            rights = rights.OrderBy(x => x.SortOrder).ToList();


            foreach (var right in rights.Where(x => x.ParentId == parentid))
            {
                var existing = rights.Count(x => x.ParentId == right.Id) > 0;

                dropDownlists.Add(right);
                if (existing)
                {
                    dropDownlists = BuildChildrenRight(ref dropDownlists, rights, right.Id, $"--");
                }
            }

            //}
            return dropDownlists;
        }
        private static List<CatalogModel> BuildChildrenCatalog(ref List<CatalogModel> dropDownlists,
           List<CatalogModel> catalogs, long rid, string prefix)
        {
            foreach (var catalog in catalogs.Where(x => x.ParentId == rid))
            {
                var existing = catalogs.Count(x => x.ParentId == catalog.Id) > 0;
                catalog.Name = $"{prefix} {catalog.Name}";
                dropDownlists.Add(catalog);
                if (existing)
                {
                    dropDownlists = BuildChildrenCatalog(ref dropDownlists, catalogs, catalog.Id, $"{prefix}--");
                }
            }
            return dropDownlists;
        }

        /// <summary>Builds the unit assigning.</summary>
        /// <param name="rights">The input.</param>
        /// <returns></returns>
        public static List<CatalogModel> BuildTreeCatalog(List<CatalogModel> catalogs, int parentid)
        {
            var dropDownlists = new List<CatalogModel>();
            if (catalogs == null)
            {

                return dropDownlists;
            }
            catalogs = catalogs.OrderBy(x => x.SortOrder).ToList();


            foreach (var catalog in catalogs.Where(x => x.ParentId == parentid))
            {
                var existing = catalogs.Count(x => x.ParentId == catalog.Id) > 0;

                dropDownlists.Add(catalog);
                if (existing)
                {
                    dropDownlists = BuildChildrenCatalog(ref dropDownlists, catalogs, catalog.Id, $"--");
                }
            }

            //}
            return dropDownlists;
        }
        
        private static List<FieldsModel> BuildChildrenFields(ref List<FieldsModel> dropDownlists,
            List<FieldsModel> fieldss, long rid, string prefix)
        {
            foreach (var fields in fieldss.Where(x => x.ParentId == rid))
            {
                var existing = fieldss.Count(x => x.ParentId == fields.Id) > 0;
                fields.Name = $"{prefix} {fields.Name}";
                dropDownlists.Add(fields);
                if (existing)
                {
                    dropDownlists = BuildChildrenFields(ref dropDownlists, fieldss, fields.Id, $"{prefix}--");
                }
            }
            return dropDownlists;
        }

        
        public static List<FieldsModel> BuildTreeFields(List<FieldsModel> fieldss, int parentid)
        {
            var dropDownlists = new List<FieldsModel>();
            if (fieldss == null)
            {

                return dropDownlists;
            }
            fieldss = fieldss.OrderBy(x => x.SortOrder).ToList();


            foreach (var fields in fieldss.Where(x => x.ParentId == parentid))
            {
                var existing = fieldss.Count(x => x.ParentId == fields.Id) > 0;

                dropDownlists.Add(fields);
                if (existing)
                {
                    dropDownlists = BuildChildrenFields(ref dropDownlists, fieldss, fields.Id, $"--");
                }
            }

            //}
            return dropDownlists;
        }
        //private static List<WarehouseModel> BuildChildrenWarehouse(ref List<WarehouseModel> dropDownlists,
        //    List<WarehouseModel> warehouses, long rid, string prefix)
        //{
        //    foreach (var warehouse in warehouses.Where(x => x.ParentId == rid))
        //    {
        //        var existing = warehouses.Count(x => x.ParentId == warehouse.Id) > 0;
        //        warehouse.Name = $"{prefix} {warehouse.Name}";
        //        dropDownlists.Add(warehouse);
        //        if (existing)
        //        {
        //            dropDownlists = BuildChildrenWarehouse(ref dropDownlists, warehouses, warehouse.Id, $"{prefix}--");
        //        }
        //    }
        //    return dropDownlists;
        //}


        //public static List<WarehouseModel> BuildTreeWarehouse(List<WarehouseModel> warehouses, int parentid)
        //{
        //    var dropDownlists = new List<WarehouseModel>();
        //    if (warehouses == null)
        //    {

        //        return dropDownlists;
        //    }
        //    warehouses = warehouses.OrderBy(x => x.SortOrder).ToList();


        //    foreach (var warehouse in warehouses.Where(x => x.ParentId == parentid))
        //    {
        //        var existing = warehouses.Count(x => x.ParentId == warehouse.Id) > 0;

        //        dropDownlists.Add(warehouse);
        //        if (existing)
        //        {
        //            dropDownlists = BuildChildrenWarehouse(ref dropDownlists, warehouses, warehouse.Id, $"--");
        //        }
        //    }


        //    return dropDownlists;
        //}


        private static List<DropDownlistObjModel> BuildChildrenWarehouse(List<DropDownlistObjModel> dropDownlists, List<WarehouseModel> warehouses, int warehouseId, string prefix)
        {
            foreach (var warehouse in warehouses.OrderBy(x => x.Level).ThenBy(x => x.SortOrder).Where(x => x.ParentId == warehouseId))
            {
                var existing = warehouses.Count(x => x.ParentId == warehouse.Id) > 0;
                var node = new DropDownlistObjModel
                {
                    Id = warehouse.Id,
                    Name = $"{prefix} {warehouse.Name}"

                };

                dropDownlists.Add(node);
                if (existing)
                {
                    dropDownlists = BuildChildrenWarehouse(dropDownlists, warehouses, warehouse.Id, $"{prefix} --");
                }
            }
            return dropDownlists;
        }
        public static List<DropDownlistObjModel> BuildWarehouseDropdown(List<WarehouseModel> input, int id)
        {
            var dropDownlists = new List<DropDownlistObjModel>();
            input = input.OrderBy(x => x.Level).ThenBy(x => x.SortOrder).ToList();
            foreach (var warehouse in input.Where(x => x.Id == id))
            {
                var existing = input.Count(x => x.ParentId == warehouse.Id) > 0;
                var node = new DropDownlistObjModel
                {
                    Id = warehouse.Id,
                    Name = warehouse.Name,
                };
                dropDownlists.Add(node);
                if (existing)
                {
                    dropDownlists = BuildChildrenWarehouse(dropDownlists, input, warehouse.Id, "--");
                }
            }

            return dropDownlists;
        }


    }
}
