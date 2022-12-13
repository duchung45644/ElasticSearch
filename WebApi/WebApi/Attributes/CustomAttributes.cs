
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.AspNetCore.Mvc.Filters;
//using System;
//using System.Net;
//using System.Security.Claims;

//namespace WebApi.Attributes
//{
//    public static class AjaxExtension
//    {
//        //HttpRequest Extension method to 
//        //check if the incoming request is an AJAX call - JRozario 
//        public static bool IsAjaxRequest(this HttpRequest request)
//        {
//            if (request == null)
//                throw new ArgumentNullException("request");

//            if (request.Headers != null)
//                return request.Headers["X-Requested-With"] == "XMLHttpRequest";
//            return false;
//        }
//    }
//    public class AuthorizeApiAttribute : TypeFilterAttribute
//    {
//        public AuthorizeApiAttribute(params string[] claim) : base(typeof(AuthorizeFilter))
//        {
//            Arguments = new object[] { claim };
//        }
//    }

//    public class AuthorizeFilter : IAuthorizationFilter
//    {
//        readonly string[] _claim;

//        public AuthorizeFilter(params string[] claim)
//        {
//            _claim = claim;
//        }

//        public void OnAuthorization(AuthorizationFilterContext context)
//        {
//            var IsAuthenticated =
//                  context.HttpContext.User.Identity.IsAuthenticated;
//            var claimsIndentity =
//                  context.HttpContext.User.Identity as ClaimsIdentity;

//            if (IsAuthenticated)
//            {
//                bool flagClaim = false;
//                foreach (var item in _claim)
//                {
//                    if (context.HttpContext.User.HasClaim(item, item))
//                        flagClaim = true;
//                }
//                if (!flagClaim)
//                {
//                    if (context.HttpContext.Request.IsAjaxRequest())
//                        context.HttpContext.Response.StatusCode =
//                        (int)HttpStatusCode.Unauthorized; //Set HTTP 401 
//                                                          //Unauthorized - JRozario
//                    else
//                        context.Result =
//                            new RedirectResult("~/Dashboard/NoPermission");
//                }
//            }
//            else
//            {
//                if (context.HttpContext.Request.IsAjaxRequest())
//                {
//                    context.HttpContext.Response.StatusCode =
//                     (int)HttpStatusCode.Forbidden; //Set HTTP 403 - JRozario
//                }
//                else
//                {
//                    context.Result = new RedirectResult("~/Home/Index");
//                }
//            }
//            return;
//        }
//    }
//}