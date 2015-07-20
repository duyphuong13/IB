using InspirationBoard.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace InspirationBoard.Controllers
{
    public class FileController : Controller
    {
        private PhuongDbContext _dbContext;
        private PhuongDbContext BoardDbContext
        {
            get
            {
                if (_dbContext == null)
                    _dbContext = new PhuongDbContext();
                return _dbContext;
            }
        }
        public ActionResult UploadImagePartial()
        {
            return PartialView();
        }

        [AcceptVerbs(HttpVerbs.Get)]
        public FilePathResult Image(string id)
        {
            //string filename = Request.Url.AbsolutePath.Replace("/file/image", "");
            string contentType = "";
            var filePath = new FileInfo(Server.MapPath("~/App_Data/") + id);

            var index = id.LastIndexOf(".") + 1;
            var extension = id.Substring(index).ToUpperInvariant();

            // Fix for IE not handling jpg image types
            contentType = string.Compare(extension, "JPG") == 0 ? "image/jpeg" : string.Format("image/{0}", extension);

            return File(filePath.FullName, contentType);
        }

        public class ClassUploadFileResult
        {
            public UploadFilesResult[] files { get; set; }
        }
        [HttpPost]
        public ContentResult UploadFiles()
        {
            var r = new List<UploadFilesResult>();

            foreach (string file in Request.Files)
            {
                HttpPostedFileBase hpf = Request.Files[file] as HttpPostedFileBase;
                if (hpf.ContentLength == 0)
                    continue;
                string fileName = Guid.NewGuid().ToString();
                var index = hpf.FileName.LastIndexOf(".") + 1;
                var extension = hpf.FileName.Substring(index).ToUpperInvariant();
                fileName = string.Format("{0}.{1}", fileName, extension);
                string savedFileName = Path.Combine(Server.MapPath("~/App_Data"), fileName);
                hpf.SaveAs(savedFileName);

                //Dictionary<string, string> versions = new Dictionary<string, string>();
                //versions.Add("_m", "width=150&height=150&scale=both&format=jpg");  // Medium size

                //string filePrefix = productId + "_" + imageNo;
                //versions.Add("_s", "width=90&height=90&scale=both&format=jpg");  // Small size
                //versions.Add("_l", "width=300&height=300&scale=both&format=jpg");  // Large size

                //foreach (string fileSuffix in versions.Keys)
                //{
                //    // Generate a filename
                //    string fileName = Path.Combine(uploadPath, filePrefix + fileSuffix);

                //    // Let the image builder add the correct extension based on the output file type
                //    fileName = ImageBuilder.Current.Build(imageFile, fileName, new ResizeSettings(versions[fileSuffix]), false, true);
                //}

                BoardDbContext.PhotoItems.Add(new PhotoItem
                    {
                        UserId = 1,
                        CreatedDate = DateTime.Now,
                        Url = fileName,
                        CategoryId = 1,
                        UserName = "Phuong Nguyen"

                    });
                BoardDbContext.SaveChanges();
                r.Add(new UploadFilesResult()
                {
                    Name = hpf.FileName,
                    Length = hpf.ContentLength,
                    Type = hpf.ContentType,
                    Url = @"/cdn/images/" + fileName,
                    ThumbnailUrl = string.Format(@"/cdn/images/{0}?w=80&h=80", fileName),
                    deleteUrl = @"/cdn/images/" + fileName,
                });

            }
            ClassUploadFileResult result = new ClassUploadFileResult();
            result.files = r.ToArray();
            var a = new System.Web.Script.Serialization.JavaScriptSerializer();
            var jsonResult = a.Serialize(result);
            return Content(jsonResult);
            //return Content("{ \"thumbnailUrl\":\"" + r[0].ThumbnailUrl + "\" ,  \"url\":\"" + r[0].Url + "\",  \"name\":\"" + r[0].Name + "\",\"type\":\"" + r[0].Type + "\",\"size\":\"" + string.Format("{0} bytes", r[0].Length) + "\"}", "application/json");
        }

    }
}