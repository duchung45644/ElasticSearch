using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using System;
using System.IO;
using System.Text;
using System.Threading.Tasks;
using WebApi.Helper;
using WebApi.Repository;
using WebApi.Services;

namespace WebApi
{
    public class Startup
    {

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;

        }
        public static IConfiguration StaticConfig { get; private set; }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            //Inject AppSettings
            //services.Configure<ApplicationSettings>(Configuration.GetSection("ApplicationSettings"));
            services.AddCors();
            services.AddControllers()
                             .AddNewtonsoftJson(options =>
                             {
                                 options.SerializerSettings.NullValueHandling = NullValueHandling.Ignore;
                                 options.SerializerSettings.ContractResolver = new DefaultContractResolver();
                             });



            //Jwt Authentication 

            var key = Encoding.UTF8.GetBytes(Configuration["AppConfiguration:JWT_Secret"].ToString());

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddJwtBearer(options =>
                    {
                        options.TokenValidationParameters = new TokenValidationParameters
                        {
                            ValidateIssuer = true,
                            ValidateAudience = true,
                            ValidateLifetime = true,
                            ValidateIssuerSigningKey = true,

                            ValidIssuer = "Niq.Security.Bearer",
                            ValidAudience = "Niq.Security.Bearer",
                            IssuerSigningKey = JwtSecurityKey.Create(Configuration["AppConfiguration:JWT_Secret"].ToString())
                        };

                        //options.Events = new JwtBearerEvents
                        //{
                        //    OnAuthenticationFailed = context =>
                        //    {
                        //      //  Console.WriteLine("OnAuthenticationFailed: " + context.Exception.Message);
                        //        return Task.CompletedTask;
                        //    },
                        //    OnTokenValidated = context =>
                        //    {
                        //      //  Console.WriteLine("OnTokenValidated: " + context.SecurityToken);
                        //        return Task.CompletedTask;
                        //    }
                        //};
                    });

            // services.AddAuthorization();
            services.AddAuthorization(options =>
            {
                options.AddPolicy(Policies.Member, policy => policy.RequireClaim(Policies.Member));
                options.AddPolicy(Policies.Admin, policy => policy.RequireClaim(Policies.Admin));
            });
            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            services.AddScoped<ICommonRepository, CommonRepository>();
            services.AddScoped<ICommonService, CommonService>();
            services.AddScoped<ICacheProviderService, CacheProviderService>();
            #region system

            services.AddScoped<IDepartmentService, DepartmentService>();
            services.AddScoped<IUserService, UserService>();
            services.AddScoped<IRightService, RightService>();
            services.AddScoped<IRoleService, RoleService>();
            services.AddScoped<IConfigurationService, ConfigurationService>();
            services.AddScoped<IStaffService, StaffService>();
            #endregion

            services.AddScoped<IDocumentArchiveService, DocumentArchiveService>();
            services.AddScoped<IFormlyService, FormlyService>();
            services.AddScoped<IRecordService, RecordService>();
            services.AddScoped<IProvinceService, ProvinceService>();
            services.AddScoped<ICommuneService, CommuneService>();
            services.AddScoped<IDistrictService, DistrictService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IBoxService, BoxService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IPositionService, PositionService>();
            services.AddScoped<IDashboardService, DashboardService>();
            services.AddScoped<IAccessmonitorService, MonitorService>();
            services.AddScoped<IRegistrasionlistService, RegistrasionlistService>();
            services.AddScoped<IListService, ListService>();
            services.AddScoped<IDocofrequestService, DocofrequestService>();
            services.AddScoped<IReturnrecordService, ReturnrecordService>();

            services.AddScoped<IFondService, FondService>();
            services.AddScoped<IWarehouseService, WarehouseService>();
            services.AddScoped<IShelfService, ShelfService>();
            services.AddScoped<ICatalogService, CatalogService>();
            services.AddScoped<IFieldsService, FieldsService>();
            services.AddScoped<IConditionService, ConditionService>();
            services.AddScoped<IApproveService, ApproveService>();
            services.AddScoped<IRegistrasionlistService, RegistrasionlistService>();
            services.AddScoped<IListService, ListService>();
            services.AddScoped<IDocofrequestService, DocofrequestService>();
            services.AddScoped<IReturnrecordService, ReturnrecordService>();
            services.AddScoped<IRenewalprofileService, RenewalprofileService>();
            services.AddScoped<IFondService, FondService>();
            services.AddScoped<IPayRecordService, PayRecordService>();
            services.AddScoped<IUnaffectedService, UnaffectedService>();
            services.AddScoped<IRecordtypeService, RecordtypeService>();
            services.AddScoped<IBorrowSlipListService, BorrowSlipListService>();
            services.AddScoped<IBorrowReturnExtendService, BorrowReturnExtendService>();
            services.AddScoped<IDocumentReturnHistoryService, DocumentReturnHistoryService>();
            services.AddScoped<IManagementApprovalService, ManagementApprovalService>();

        }

            public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
            {
                if (env.IsDevelopment())
                {
                    app.UseDeveloperExceptionPage();
                }
                else
                {
                    app.UseExceptionHandler("/Home/Error");
                }

                app.UseStaticFiles();
                app.UseCookiePolicy();
                app.UseStaticFiles();
                app.UseStaticFiles(new StaticFileOptions()
                {
                    FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                    RequestPath = new PathString("/Resources")
                });
                //Add JWToken Authentication service

                app.UseRouting();


                // global cors policy
                app.UseCors(x => x
                    .AllowAnyMethod()
                    .AllowAnyHeader()
                    .SetIsOriginAllowed(origin => true) // allow any origin
                    .AllowCredentials()); // allow credentials

                app.UseAuthentication();

                app.UseAuthorization();
                app.UseEndpoints(endpoints =>
                {
                    endpoints.MapControllers();
                });

            }
        }
    }
