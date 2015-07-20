using ImageResizer;
using System;
using System.Drawing;
using System.IO;
using System.Web.Mvc;

namespace InspirationBoard.Controllers
{
    public class ImagesController : Controller
    {
        [AcceptVerbs(HttpVerbs.Get)]
        public FileContentResult Index(string filename, int w = 0, int h = 0)
        {
            try
            {
                string contentType = "";
                var filePath = new FileInfo(Server.MapPath("~/App_Data/") + filename);

                var index = filename.LastIndexOf(".") + 1;
                var extension = filename.Substring(index).ToUpperInvariant();

                // Fix for IE not handling jpg image types
                contentType = string.Compare(extension, "JPG") == 0 ? "image/jpeg" : string.Format("image/{0}", extension);

                Bitmap bmImage = null;
                if (w > 0 && h > 0)
                {
                    //&format={3}
                    string querySetting = String.Format("width={0};height={1};crop={2}", w, h, "auto");
                    var resizeSetting = new ResizeSettings(querySetting);
                    bmImage = ImageBuilder.Current.Build(filePath.FullName, resizeSetting);
                }
                else
                {
                    bmImage = ImageBuilder.Current.LoadImage(filePath.FullName, new ResizeSettings());
                }
                byte[] byteArray = ImageHelpers.BitmapToBytes(bmImage);
                return File(byteArray, contentType);
            }
            catch
            {
                throw new FileNotFoundException();

            }
        }

    }




}