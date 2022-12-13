using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using WebApi.Helper;
using WebApi.Models;
using WebApi.Models.Request;
using WebApi.Repository;

namespace WebApi.Services
{

    public interface IStaffService
    {
        IEnumerable<StaffModel> GetAllStaff();
        Response Create(StaffModel entry);
        StaffModel GetStaffById(int id);
        Response Update(StaffModel entry);
        Response Delete(int id);
        IEnumerable<StaffModel> GetAllByUnitId(GetByPageRequest request);
        Response ResetPassword(StaffModel model); Response StaffResetPassword(StaffModel staff);
        IEnumerable<RoleModel> GetRoleStaff(int id);
        Response SaveRoleOfStaff(StaffModel model);
        Response SaveUserProfile(StaffModel model);
    }
    public class StaffService : IStaffService
    {
        /// <summary>
        /// Declare resposity
        /// </summary>
        /// <param name="psqlConn"></param>
        /// <author>louis</author>	
        private readonly ICommonRepository _respository;

        public StaffService(ICommonRepository respository)
        {
            _respository = respository;
        }

        /// <summary>
        /// Get all values
        /// </summary>
        /// <returns>List values</returns>
        /// <author>Louis</author>
        public IEnumerable<StaffModel> GetAllStaff()
        {
            var staffs = _respository.GetListByStore<StaffModel>("acc.[Prc_StaffGetAll]", new { });

            return staffs;
        }
 
        /// <summary>
        /// Get values by Id
        /// </summary>
        /// <returns>value by Id</returns>
        /// <author>Louis</author>
        public StaffModel GetStaffById(int id)
        {
            return _respository.GetObjectByStore<StaffModel>("[acc].Prc_StaffGetById", new { Id =id });
        }

        /// <summary>
        /// Insert a new row and return the identity
        /// </summary>
        /// <returns>new identity</returns>
        /// <author>Louis</author>
        public Response Create(StaffModel staff)
        {
            
            var arg = new
            {
                staff.DepartmentId,
                staff.UnitId,
                staff.Code,
                staff.FirstName,
                staff.LastName,
                staff.Gender,
                staff.UserName,
                staff.Password,
                staff.Image,
                staff.Email,
                staff.Phone,
                staff.Mobile,
                staff.BirthOfDay,
                staff.Address,
                staff.IDCard,
                staff.IDCardDate,
                staff.IDCardPlace,
                staff.IsAdministrator,
                staff.IsLocked,
                staff.CreatedUserId,
                staff.PositionId,
                staff.PlaceOfReception,
                staff.DossierReturnAddress,
                staff.DepartmentNameReceive,
                staff.PhoneOfDepartmentReceive,
                InsertRoles = "",
                staff.UnitResolveInformation,
                staff.IsRepresentUnit,
                staff.IsRepresentDepartment
            };
            var response = _respository.GetObjectByStore<Response>("[acc].[Prc_StaffInsert]",  arg);
            return response;
        }

        /// <summary>
        /// Update the exist row
        /// </summary>
        /// <author>Louis</author>
        public Response Update(StaffModel staff)
        {
            
            var arg = new
            {
                staff.Id,
                staff.FirstName,
                staff.LastName,
                staff.Gender,
                staff.Email,
                staff.Image,
                staff.IsAdministrator,
                staff.IsLocked,
                staff.ModifiedUserId,
                staff.DepartmentId,
                staff.UnitId,
                staff.BirthOfDay,
                staff.Code,
                staff.IDCard,
                staff.IDCardDate,
                staff.IDCardPlace,
                staff.Address,
                staff.Phone,
                staff.Mobile,
                staff.PositionId,
                staff.PlaceOfReception,
                staff.DossierReturnAddress,
                staff.DepartmentNameReceive,
                staff.PhoneOfDepartmentReceive,
                InsertRoles = "",
                DeletedRoles = "",
                staff.UnitResolveInformation,
                staff.IsRepresentUnit,
                staff.IsRepresentDepartment
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_StaffUpdate]", arg);
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
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_StaffDelete]", arg);
            return response;
        }

        public IEnumerable<StaffModel> GetAllByUnitId(GetByPageRequest request)
        {
            return _respository.GetListByStore<StaffModel>("[acc].[Prc_StaffGetAllByUnit]", new
            {
                request.DepartmentId,
                request.UnitId
            });
        }

        public Response ResetPassword(StaffModel staff)
        {
            var arg = new
            {
                staff.Id,
                staff.Password
            };
            return _respository.GetObjectByStore<Response>("[acc].[Prc_StaffResetPasswordByAdmin]", arg);
        }


        public Response StaffResetPassword(StaffModel staff)
        {

            var arg = new
            {
                staff.Id,
                Password = staff.Password.ComputeSha256Hash(),
                NewPassword = staff.NewPassword.ComputeSha256Hash(),
            };
            return _respository.GetObjectByStore<Response>("[acc].[Prc_StaffResetPassword]", arg);
        }

        public IEnumerable<RoleModel> GetRoleStaff(int id)
        {
            return _respository.GetListByStore<RoleModel>("[acc].[Prc_RoleOfStaffGetByStaffId]", new
            {
                StaffId = id
            });
        }

        public Response SaveRoleOfStaff(StaffModel model)
        {

            var insertedArray = string.Join(",", model.InsertRoles);
            var arg = new
            {
                model.Id,
                InsertRoles = insertedArray
            };
            var response = _respository.GetObjectByStore<Response>("[acc].[Prc_StaffSaveRole]", arg);
            return response;
        }

        public Response SaveUserProfile(StaffModel staff)
        {
            var arg = new
            {
                staff.Id,
                staff.FirstName,
                staff.LastName,
                staff.Gender,
                staff.Email,
                staff.Image,
                staff.IsAdministrator,
                staff.IsLocked,
                staff.ModifiedUserId,
                staff.DepartmentId,
                staff.UnitId,
                staff.BirthOfDay,
                staff.Code,
                staff.IDCard,
                staff.IDCardDate,
                staff.IDCardPlace,
                staff.Address,
                staff.Phone,
                staff.Mobile,
                staff.PositionId,
                staff.PlaceOfReception,
                staff.DossierReturnAddress,
                staff.DepartmentNameReceive,
                staff.PhoneOfDepartmentReceive,
                staff.UnitResolveInformation,
                staff.IsRepresentUnit,
                staff.IsRepresentDepartment
            };
            var response = _respository.GetObjectByStore<Response>("acc.[Prc_StaffSaveUserProfile]", arg);
            return response;
        }
    }
}

