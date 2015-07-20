using ImageResizer;
using InspirationBoard.Models;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;

namespace InspirationBoard
{
    public class ImageHelpers
    {  // This method is for converting bitmap into a byte array
        public static byte[] BitmapToBytes(Bitmap img)
        {
            byte[] byteArray = new byte[0];
            using (MemoryStream stream = new MemoryStream())
            {
                img.Save(stream, System.Drawing.Imaging.ImageFormat.Png);
                stream.Close();
                byteArray = stream.ToArray();
            }
            return byteArray;
        }

        public static void CombineImages(string jsonBoardStructure, string serverMapPath, string fileName)
        {
            //            string jsonImage = @" {'height':750,'width':750,'type':'VSPLIT','children':
            // [{'height':750,'width':246,'type':'HSPLIT','children':
            // [{'height':372,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'8490983a-0987-451e-b318-9f4707e04156','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/2e1e66a5-18b3-4d1f-a2e7-aa0336bdb882.JPG','zoom':1.62},'imgLeft':-120,'imgTop':-21,'imgHeight':603,'imgWidth':583},{'height':372,'width':246,'type':'HSPLIT','children':[{'height':183,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'ec66563d-6032-4940-aa26-9f7d9286bca7','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/c73ce218-5cbe-4388-b324-115a67f5457f.BMP','zoom':1},'imgLeft':0,'imgTop':0,'imgHeight':185,'imgWidth':246},{'height':183,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'e0c212d6-243a-4d10-8612-424a75113ace','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/2e94cc1e-e138-4e05-9482-1c6e04a8f6ca.JPG','zoom':1},'imgLeft':0,'imgTop':-79,'imgHeight':373,'imgWidth':246}]}]},{'height':750,'width':498,'type':'VSPLIT','children':[{'height':750,'width':246,'type':'HSPLIT','children':[{'height':372,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'30457824-7f77-4f99-9039-d55f2f4f4189','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/1051e3c2-eb15-4c71-903d-8594c39b05a7.JPG','zoom':1},'imgLeft':0,'imgTop':0,'imgHeight':372,'imgWidth':247},{'height':372,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'98ecf1e5-b8dc-4da7-9615-42a9915b0710','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/01d84a6f-bc00-4f7e-8658-c5bd3c078d19.JPG','zoom':1},'imgLeft':0,'imgTop':0,'imgHeight':372,'imgWidth':279}]},{'height':750,'width':246,'type':'HSPLIT','children':[{'height':372,'width':246,'type':'HSPLIT','children':[{'height':183,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'98ecf1e5-b8dc-4da7-9615-42a9915b0710','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/01d84a6f-bc00-4f7e-8658-c5bd3c078d19.JPG','zoom':1},'imgLeft':0,'imgTop':-138,'imgHeight':328,'imgWidth':246},{'height':183,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'84747483-eee6-4337-a222-0b01095b530d','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/49b67ebe-5ba9-4009-818d-836dcf879585.JPG','zoom':1},'imgLeft':0,'imgTop':0,'imgHeight':369,'imgWidth':246}]},{'height':372,'width':246,'type':'IMAGE','wwData':{'portfolioItemId':'3f2d7864-97ab-44b2-9748-fc4936df4bfd','vendorName':'Verdor Name','vendorUrl':'hahah','img':'/cdn/images/a1220ffb-af10-4ec5-9662-6b1934921c81.JPG','zoom':1},'imgLeft':0,'imgTop':0,'imgHeight':372,'imgWidth':248}]}]}]}";
            BoardStructure boardStructure = Newtonsoft.Json.JsonConvert.DeserializeObject<BoardStructure>(jsonBoardStructure);
            boardStructure.drawPosition = new PointF(0, 0);

            List<BoardStructure> allImages = BuildBoardImage(boardStructure, boardStructure.drawPosition);

            Bitmap finalImage = null;

            try
            {
                foreach (var image in allImages)
                {
                    if (image.type == "IMAGE")
                    {
                        try
                        {
                            string imageUrl = image.wwData.img.Substring(image.wwData.img.LastIndexOf('/') + 1);
                            var filePath = new FileInfo(serverMapPath + imageUrl);

                            //change size of that image first
                            string querySetting = String.Format("width={0}&height={1};&scale=both", image.imgWidth, image.imgHeight);
                            var resizeSettingResize = new ResizeSettings(querySetting);

                            //create a Bitmap from the file and add it to the list
                            Bitmap bitmapResize = ImageBuilder.Current.Build(filePath.FullName, resizeSettingResize);

                            //crop that image
                            var settingCrop = new ResizeSettings();
                            settingCrop.CropTopLeft = new PointF(-image.imgLeft, -image.imgTop);
                            settingCrop.CropBottomRight = new PointF(image.width - image.imgLeft, image.height - image.imgTop);

                            Bitmap bitmap = ImageBuilder.Current.Build(bitmapResize, settingCrop);
                            //set bitmap back
                            image.bitmapImage = bitmap;
                        }
                        catch // maybe file not found :(
                        {
                            image.bitmapImage = new Bitmap(image.width, image.height);

                            using (Graphics graph = Graphics.FromImage(image.bitmapImage))
                            {
                                Rectangle ImageSize = new Rectangle(0, 0, image.width, image.height);
                                graph.FillRectangle(Brushes.White, ImageSize);
                            }
                        }
                    }
                    else
                    {
                        image.bitmapImage = new Bitmap(image.width, image.height);

                        using (Graphics graph = Graphics.FromImage(image.bitmapImage))
                        {
                            Rectangle ImageSize = new Rectangle(0, 0, image.width, image.height);
                            graph.FillRectangle(Brushes.White, ImageSize);
                        }
                    }
                }

                //create a bitmap to hold the combined image
                finalImage = new Bitmap(750, 750);

                //get a graphics object from the image so we can draw on it
                using (Graphics g = Graphics.FromImage(finalImage))
                {
                    //set background color
                    g.Clear(System.Drawing.Color.White);

                    //go through each image and draw it on the final image 
                    foreach (var imageWithPosition in allImages)
                    {
                        g.DrawImage(imageWithPosition.bitmapImage,
                          new System.Drawing.Rectangle((int)imageWithPosition.drawPosition.X, (int)imageWithPosition.drawPosition.Y,
                              imageWithPosition.bitmapImage.Width, imageWithPosition.bitmapImage.Height));
                    }
                }
                var desFilePath = new FileInfo(serverMapPath + fileName + ".PNG");
                //                ImageBuilder.Current.Build(finalImage,desFilePath, new Instructions());
                if (System.IO.File.Exists(desFilePath.FullName))
                    System.IO.File.Delete(desFilePath.FullName);

                finalImage.Save(desFilePath.FullName, System.Drawing.Imaging.ImageFormat.Png);
            }
            catch (Exception ex)
            {
                if (finalImage != null)
                    finalImage.Dispose();

                throw ex;
            }
            finally
            {
                //clean up memory
                foreach (var image in allImages)
                {
                    image.bitmapImage.Dispose();
                }
            }
        }
        private static List<BoardStructure> BuildBoardImage(BoardStructure boardStructure, PointF previousPosition)
        {

            List<BoardStructure> result = new List<BoardStructure>();
            PointF current = previousPosition;
            switch (boardStructure.type)
            {
                case "IMAGE":
                case "EMPTY":
                    boardStructure.drawPosition = previousPosition;
                    result.Add(boardStructure);
                    return result;

                case "VSPLIT":

                    for (int i = 0; i < boardStructure.children.Count(); i++)
                    {
                        if (i != 0)
                        {
                            current.X += boardStructure.children[i - 1].width + 6;
                        }
                        result.AddRange(BuildBoardImage(boardStructure.children[i], current));
                    }
                    break;
                case "HSPLIT":
                    for (int i = 0; i < boardStructure.children.Count(); i++)
                    {
                        if (i != 0)
                        {
                            current.Y += boardStructure.children[i - 1].height + 6;
                        }
                        result.AddRange(BuildBoardImage(boardStructure.children[i], current));
                    }
                    break;
            }

            return result;
        }

    }
}