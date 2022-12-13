//using System;
//using System.Barcode.Lib;
//using System.Collections.Generic;
//using System.Drawing.Imaging;
//using System.Drawing;
//using System.IO;
//using System.Linq;
//using System.Threading.Tasks;

//namespace WebApi.Helper
//{
//    public static class BarcodeHelper
//    {
//        public static string RenderBarcode(string code)
//        {
//            string barcodeString = "";
//            //generate barcode from applicant code
//            var barcode = new Barcode
//            {
//                Alignment = AlignmentPositions.CENTER,
//                IncludeLabel = true,
//                RotateFlipType = (RotateFlipType)Enum.Parse(typeof(RotateFlipType), "RotateNoneFlipNone", true),
//                LabelPosition = LabelPositions.BOTTOMCENTER,
//                Width = 320,
//                Height = 60,
//                BackColor = Color.White,
//                ForeColor = Color.Black
//            };

//            //===== Encoding performed here =====
//            var image = barcode.Encode(TYPE.CODE93, code);
//            using (var memoryStream = new MemoryStream())
//            {
//                image.Save(memoryStream, ImageFormat.Png);
//                barcodeString = $"data:image/jpg;base64,{Convert.ToBase64String(memoryStream.ToArray())}";
//                return barcodeString;
//            }
//        }
//        public static string RenderQRcode(string code)
//        {
//            var imageQr = QRCodeHelper.EncodeData(code);
//            using (var memoryStream = new MemoryStream())
//            {

//                imageQr.Save(memoryStream, ImageFormat.Png);
//                applicants.Qrcode = $"data:image/jpg;base64,{Convert.ToBase64String(memoryStream.ToArray())}";
//            }
//        }
//    }
