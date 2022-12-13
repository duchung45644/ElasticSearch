using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Helper
{
    public static class Extensions
    {
        /// <summary>
        /// Compare 2 strings is equal
        /// </summary>
        /// <param name="self"></param>
        /// <param name="destString"></param>
        /// <returns></returns>
        public static bool Similar(this string self, string destString)
        {
            return self.ToLower() == destString.ToLower();
        }

        /// <summary>
        /// To lower the first character of string: ConcreteString -> concreteString
        /// </summary>
        /// <param name="self"></param>
        /// <returns></returns>
        public static string ToLowerFirst(this string self)
        {
            if (string.IsNullOrEmpty(self)) return self;
            return self.Substring(0, 1).ToLower() + self.Substring(1);
        }

        ///// <summary>
        ///// 
        ///// </summary>
        ///// <param name="self"></param>
        ///// <returns></returns>
        //public static string MD5Hash(this string self)
        //{
        //    if (string.IsNullOrEmpty(self)) return self;

        //    MD5 md5 = new MD5CryptoServiceProvider();

        //    //compute hash from the bytes of text
        //    md5.ComputeHash(Encoding.ASCII.GetBytes(self));

        //    //get hash result after compute it
        //    byte[] result = md5.Hash;

        //    var strBuilder = new StringBuilder();
        //    foreach (byte t in result)
        //    {
        //        //change it into 2 hexadecimal digits
        //        //for each byte
        //        strBuilder.Append(t.ToString("x2"));
        //    }
        //    return strBuilder.ToString();
        //}

        public static string ComputeSha256Hash(this string rawData)
        {

            if (string.IsNullOrEmpty(rawData)) return rawData;
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
        public static List<E> MixList<E>(List<E> inputList)
        {
            if (inputList == null || inputList.Count == 0) return new List<E>();
            if (inputList.Count == 1) return inputList;

            List<E> randomList = new List<E>();

            Random r = new Random();
            int randomIndex = 0;
            if (inputList.Count == 2)
            {
                randomList.Add(inputList[1]);
                randomList.Add(inputList[0]);
            }
            else
            {
                while (inputList.Count > 0)
                {
                    randomIndex = r.Next(0, inputList.Count); //Choose a random object in the list
                    randomList.Add(inputList[randomIndex]); //add it to the new, random list
                    inputList.RemoveAt(randomIndex); //remove to avoid duplicates
                }
            }

            return randomList; //return the new random list
        }

        public static object GetValue(this Dictionary<string, object> value, string key)
        {
            return value.ContainsKey(key) ? value[key] : "";
        }

        public static DateTime GetFirstDayOfWeek(this DateTime sourceDateTime)
        {
            var daysAhead = (DayOfWeek.Sunday - (int)sourceDateTime.DayOfWeek);

            sourceDateTime = sourceDateTime.AddDays((int)daysAhead);

            return sourceDateTime;
        }

        public static DateTime GetLastDayOfWeek(this DateTime sourceDateTime)
        {
            var daysAhead = DayOfWeek.Saturday - (int)sourceDateTime.DayOfWeek;

            sourceDateTime = sourceDateTime.AddDays((int)daysAhead);

            return sourceDateTime;
        }


        public static string ToDateTimeVnString(this DateTime sourceDateTime)
        {
            return sourceDateTime.ToString("dd/MM/yyyy HH:mm:ss");
        }

        public static string ToDateTimeVnString(this DateTime? sourceDateTime)
        {
            if (sourceDateTime.HasValue)
            {
                return sourceDateTime.Value.ToString("dd/MM/yyyy HH:mm:ss");
            }
            return "";
        }
        public static string Formatting(this string value)
        {
            if (string.IsNullOrEmpty(value)) return value;
            string[] strDestination = value.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
            foreach (string pStr in strDestination)
            {
                value += pStr + " ";
            }
            return value.Trim();
        }

        public static String Base64Encode(this String value)
        {
            if (String.IsNullOrEmpty(value))
                return "";

            var plainTextBytes = Encoding.UTF8.GetBytes(value);
            return Convert.ToBase64String(plainTextBytes);
        }

        /// <summary>
        /// Base64s the decode.
        /// </summary>
        /// <param name="value">The value.</param>
        /// <returns></returns>
        public static String Base64Decode(this String value)
        {
            if (String.IsNullOrEmpty(value))
                return "";

            var bytes = Convert.FromBase64String(value);
            return Encoding.UTF8.GetString(bytes);
        }
        public static string AsVnWithTimeString(this DateTime? value)
        {
            if (!value.HasValue || value.Value == DateTime.MinValue)
                return "";
            return value.Value.ToString("dd/MM/yyyy HH:mm");
        }
        public static string AsNumberString(this double? value)
        {
            if (!value.HasValue)
                return "";
            return String.Format("{0:#,##0.##}", value.Value);  
        }
    }
}
