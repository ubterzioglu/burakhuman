#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\App_Code\sayfa.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "2E925FC044727441CE68D0E8459B5701170D89B1"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\App_Code\sayfa.cs"
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text.RegularExpressions;
using System.Web;
using System.Web.UI.WebControls;
using System.Net.Mail;
using System.Runtime.Remoting.Contexts;
using System.IO;
using System.Data;
using System.Net;
using System.Text;
using System.Security.Policy;
using System.Web.UI.HtmlControls;
using System.Web.UI;

/// <summary>
/// Summary description for sayfa
/// </summary>
public class sayfa
{

    public MySqlConnection baglanti = new MySqlConnection(ConfigurationManager.ConnectionStrings["connStr"].ConnectionString);
    public MySqlCommand komut = new MySqlCommand();
    public MySqlDataReader dr;

    public sayfa()
    {

    }


    public bool orjinalkayit(string isim, FileUpload fu)// tekli fotoğraf eklemek için
    {
        try
        {


            System.Drawing.Image orjinalFoto = null;
            HttpPostedFile dosya = fu.PostedFile;
            orjinalFoto = System.Drawing.Image.FromStream(dosya.InputStream);
            dosya.SaveAs(HttpContext.Current.Server.MapPath("~/Dosyalar/orjinal/" + isim));

            boyutlandir(orjinalFoto, 64, isim, "thumb");
            boyutlandir(orjinalFoto, 300, isim, "kucuk");
            boyutlandir(orjinalFoto, 500, isim, "orta");
            return true;
        }
        catch (Exception)
        {
            return false;
        }
        return false;
    }

    public bool orjinalkayitpf(string isim, HttpPostedFile pf) // çoklu fotoğraf eklemek için
    {
        try
        {
            System.Drawing.Image orjinalFoto = null;
            HttpPostedFile dosya = pf;
            orjinalFoto = System.Drawing.Image.FromStream(dosya.InputStream);
            dosya.SaveAs(HttpContext.Current.Server.MapPath("~/Dosyalar/orjinal/" + isim));
            boyutlandir(orjinalFoto, 64, isim, "thumb");
            boyutlandir(orjinalFoto, 160, isim, "kucuk");
            boyutlandir(orjinalFoto, 400, isim, "orta");
            boyutlandir(orjinalFoto, 900, isim, "buyuk");
            return true;
        }
        catch (Exception)
        {
            return false;
        }
        return false;
    }

    public bool boyutlukaydet(string isim, HttpPostedFile pf, int boyut, string path) // çoklu fotoğraf eklemek için
    {
        try
        {
            System.Drawing.Image orjinalFoto = null;
            HttpPostedFile dosya = pf;
            orjinalFoto = System.Drawing.Image.FromStream(dosya.InputStream);
            boyutlandir(orjinalFoto, boyut, isim, path);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
        return false;
    }

    public bool orjinalkaydet(string isim, HttpPostedFile pf)
    {
        bool ret = true;
        try
        {
            pf.SaveAs(HttpContext.Current.Server.MapPath("~/Dosyalar/orjinal/" + isim));
        }
        catch (Exception)
        {
            ret = false;
        }

        return ret;
    }

    public void fotografkaydet(string isim, FileUpload fu, List<string> paths, List<int> values, bool orjinal = false)
    {
        int i = 0;
        foreach (var item in paths)
        {
            int boyut = values[i];
            boyutlukaydet(isim, fu.PostedFile, boyut, paths[i]);
            i++;
        }

        if (orjinal)
        {
            orjinalkaydet(isim, fu.PostedFile);
        }
    }


    public void boyutlandir(System.Drawing.Image orjinalFoto, int boyut, string dosyaAdi, string kayitYeri, string bgcolor = "#ffffff")
    {
        System.Drawing.Bitmap islenmisFotograf = null;
        System.Drawing.Graphics grafik = null;

        int hedefGenislik = boyut;
        int hedefYukseklik = boyut;
        int new_width, new_height;

        new_height = (int)Math.Round(((float)orjinalFoto.Height * (float)boyut) / (float)orjinalFoto.Width);
        new_width = hedefGenislik;
        hedefYukseklik = new_height;
        new_width = new_width > hedefGenislik ? hedefGenislik : new_width;
        new_height = new_height > hedefYukseklik ? hedefYukseklik : new_height;

        islenmisFotograf = new System.Drawing.Bitmap(hedefGenislik, hedefYukseklik);
        grafik = System.Drawing.Graphics.FromImage(islenmisFotograf);
        grafik.FillRectangle(new System.Drawing.SolidBrush(System.Drawing.ColorTranslator.FromHtml(bgcolor)), new System.Drawing.Rectangle(0, 0, hedefGenislik, hedefYukseklik));
        int paste_x = (hedefGenislik - new_width) / 2;
        int paste_y = (hedefYukseklik - new_height) / 2;

        grafik.SmoothingMode = System.Drawing.Drawing2D.SmoothingMode.HighQuality;
        grafik.CompositingQuality = System.Drawing.Drawing2D.CompositingQuality.HighQuality;
        grafik.InterpolationMode = System.Drawing.Drawing2D.InterpolationMode.HighQualityBicubic;

        System.Drawing.Imaging.ImageCodecInfo codec = System.Drawing.Imaging.ImageCodecInfo.GetImageEncoders()[1];
        System.Drawing.Imaging.EncoderParameters eParams = new System.Drawing.Imaging.EncoderParameters(1);
        eParams.Param[0] = new System.Drawing.Imaging.EncoderParameter(System.Drawing.Imaging.Encoder.Quality, 95L);

        grafik.DrawImage(orjinalFoto, paste_x - 1, paste_y - 1, new_width + 1, new_height + 1);
        islenmisFotograf.Save(HttpContext.Current.Server.MapPath("~/Dosyalar/" + kayitYeri + "/" + dosyaAdi), codec, eParams);
    }

    public string fix(string veri)
    {
        if (veri != null)
        {
            veri = Regex.Replace(veri, @"<(.|\n)*?>", string.Empty);
            veri = Regex.Replace(veri, @"[^\w\s\.,=():/&@-]", string.Empty);
        }
        return veri;
    }

    public string shortingletter(string metin, int karakter, string devami = "...")
    {
        string temp = metin;
        try
        {
            if (temp.Length > karakter) temp = temp.Substring(0, karakter) + devami;
        }
        catch (Exception)
        {

        }
        return temp;
    }

    public string shortingeval(object o, int karakter, string devami)
    {
        string temp = o.ToString();
        if (temp.Length > karakter) temp = temp.Substring(0, karakter) + devami;

        return temp;
    }

    public int counttable(string tablename, string command)
    {
        string say = "";
        komut.CommandText = "SELECT count(*) FROM " + tablename + " " + command;
        komut.Connection = baglanti;
        baglanti.Open();
        say = komut.ExecuteScalar().ToString();
        baglanti.Close();
        return Convert.ToInt32(say);
    }

    public void delete(string table, string prm, string id)
    {
        Boolean file = (table == "files") ? true : false;

        string command = "Where " + prm + "=" + id;

        try
        {  
        deletefile(table, command, file);
        }
        catch (Exception)
        {
            baglanti.Close();
        }
        
        komut.CommandText = "delete from " + table + " " + command;
        komut.Connection = baglanti;
        baglanti.Open();
        komut.ExecuteNonQuery();
        baglanti.Close();
        if (!file) delete("files", "AlbumId", id);
    }

    public void deletefile(string table, string command, Boolean file = false)
    {
        bool devam = true;
        string sutun = (file) ? "FileUrl" : "PictureUrl";


        string guid = SatirBilgileriGetir(sutun, table, command);
        int count = counttable(table, "Where " + sutun + "='" + guid + "'");
        if (count > 1) devam = false;



        if (devam)
        {
            komut.CommandText = "select * from " + table + " " + command;
            komut.Connection = baglanti;
            baglanti.Open();
            dr = komut.ExecuteReader();



            while (dr.Read())
            {
                try
                {
                    deleteobject("~/Dosyalar/orta/" + dr[sutun]);
                    deleteobject("~/Dosyalar/kucuk/" + dr[sutun]);
                    deleteobject("~/Dosyalar/buyuk/" + dr[sutun]);
                    deleteobject("~/Dosyalar/orjinal/" + dr[sutun]);
                    deleteobject("~/Dosyalar/reklam/" + dr[sutun]);
                    deleteobject("~/Dosyalar/videolar/" + dr[sutun]);
                    deleteobject("~/Dosyalar/thumb/" + dr[sutun]);
                }
                catch (Exception error)
                {
                }

            }
            baglanti.Close();
        }
    }

    public void deleteobject(string path)
    {
        try
        {
            File.Delete(HttpContext.Current.Server.MapPath(path));
        }
        catch (Exception)
        {

        }
    }

    public string SatirBilgileriGetir(string sutun, string table, string command)
    {
        string temp = null;
        komut.CommandText = "SELECT " + sutun + " from " + table + " " + command;
        komut.Connection = baglanti;
        baglanti.Open();
        dr = komut.ExecuteReader();
        while (dr.Read())
        {
            temp = dr[sutun].ToString();
        }
        baglanti.Close();
        return temp;
    }


    public string inored(string table, string primarykey, int id, List<string> columns, List<string> values, bool tarih = false, bool update = false)
    {

        komut.Parameters.Clear();
        string command = "";
        if (id <= 0)
        {
            string types = "";
            string vals = "";
            foreach (var items in columns)
            {
                types += items + ",";
                vals += "@" + items + ",";
            }


            int l = types.Count();
            int k = vals.Count();
            types = types.Remove(l - 1);
            vals = vals.Remove(k - 1);

            if (tarih)
            {
                types += ",CreatedDate";
                vals += ",@Date";
            }

                if (update)
                {
                    types += ",Date";
                    vals += ",@Date";
                }
            command = "insert into " + table + " (" + types + ") values (" + vals + ")";
        }

        else
        {
            string upds = "";
            int i = 0;
            foreach (var items in columns)
            {
                upds += items + "=";
                upds += "@" + items + ",";
                i++;
            }

            int l = upds.Count();
            upds = upds.Remove(l - 1);

            if (update) upds += ",Date=@Date";


            command = "update " + table + "  set " + upds + " Where " + primarykey + "=" + id;



        }

        try
        {
            int k = 0;
            foreach (var items in values)
            {
                komut.Parameters.Add("@" + columns[k], items);
                k++;
            }
            komut.CommandText = command;
            komut.Connection = baglanti;
            baglanti.Open();
            komut.Parameters.Add("@Date", DateTime.Now);
            komut.ExecuteNonQuery();
            baglanti.Close();
            komut.Parameters.Clear();
        }
        catch (Exception er)
        {
            baglanti.Close();
            return er.Message;
        }

        long x = komut.LastInsertedId;
        return x.ToString();
    }

    public void logging(string pagename, string logdetail, string logprocess)
    {
        DateTime tarih = DateTime.Now;
        int userid = GetAdminId();

        komut.CommandText = "Insert into log (PageName,LogDetail,LogProcess,UserId,Date) values (@PageName,@LogDetail,@LogProcess,@UserId,@Date)";
        komut.Parameters.Clear();
        komut.Parameters.Add("@PageName", pagename);
        komut.Parameters.Add("@LogDetail", logdetail);
        komut.Parameters.Add("@LogProcess", logprocess);
        komut.Parameters.Add("@UserId", userid);
        komut.Parameters.Add("@Date", tarih);
        komut.Connection = baglanti;
        baglanti.Open();
        komut.ExecuteNonQuery();
        baglanti.Close();
    }



    public int GetAdminId()
    {
        string session = HttpContext.Current.Request["session"];
        session = fix(session);
        string tempstatus = SatirBilgileriGetir("AdminId", "adminsessions", "where SessionKey='" + session + "' and Status=1");
        int status = 0;
        if (tempstatus != "" && tempstatus != null)
        {
            status = Convert.ToInt32(tempstatus.ToString());
        }
        return status;
    }


    public string adminlogin(string UserName, string UserPassword)
    {
        if (GetAdminId() != 0) return "0";
        string userip = HttpContext.Current.Request.UserHostAddress;

        string username = fix(UserName);
        string userpassword = fix(UserPassword);
        string userid = SatirBilgileriGetir("AdminId", "admin", "where AdminNick='" + username + "' and AdminPassword='" + userpassword + "'");
        string uyead = SatirBilgileriGetir("AdminNick", "admin", "where AdminNick='" + username + "' and AdminPassword='" + userpassword + "'");

        if (userid == null) return "0";
        else
        {
            string sessionkey = Guid.NewGuid().ToString().Replace("-", string.Empty);
            DateTime date = DateTime.Now;
            baglanti.Open();
            komut = new MySqlCommand("INSERT INTO adminsessions(SessionKey,AdminId,AdminNick,Date,SessionIp,Status) VALUES (@SessionKey,@AdminId,@AdminNick,@date,@SessionIp,@Status)", baglanti);
            komut.Parameters.Add("@SessionKey", sessionkey);
            komut.Parameters.Add("@AdminId", userid);
            komut.Parameters.Add("@AdminNick", username);
            komut.Parameters.Add("@date", date);
            komut.Parameters.Add("@SessionIp", userip);
            komut.Parameters.Add("@Status", true);
            komut.ExecuteReader();
            komut.Dispose();
            baglanti.Dispose();
            baglanti.Close();

            komut.Parameters.Clear();


            HttpCookie session = HttpContext.Current.Response.Cookies["session"];
            if (session == null) session = new HttpCookie("session");
            session.Value = sessionkey;
            HttpContext.Current.Response.Cookies.Add(session);
            return "1";
        }
    }



    public void SendMail(string konu, string mesaj, string mailto)
    {
        string email = "musteri@yazarge.com";

        SmtpClient istemci = new SmtpClient("mail.yazarge.com", 587);
        MailAddress gonderen = new MailAddress(email, "Yazarge Test");
        MailAddress alici = new MailAddress(mailto, "Yazarge Test");
        MailMessage mail = new MailMessage(gonderen, alici);
        mail.IsBodyHtml = true;
        mail.Subject = konu;
        mail.Body = mesaj;

        istemci.Credentials = new System.Net.NetworkCredential("musteri@yazarge.com", "mstrmail41");
        istemci.Send(mail);

    }

    public string userlogin(string MailAdres, string UserPassword)
    {
        bool x = TestEmailRegex(MailAdres);
        if (islogin() != 0) return "0";
        else if (x == false) return "-1";
        string userip = HttpContext.Current.Request.UserHostAddress;

        string mail = MailAdres;
        string userpassword = fix(UserPassword);
        string userid = SatirBilgileriGetir("UyeId", "uye", "where MailAdres='" + mail + "' and Sifre='" + userpassword + "'");

        if (userid == null) return "0";
        else
        {
            string sessionkey = Guid.NewGuid().ToString().Replace("-", string.Empty);
            DateTime date = DateTime.Now;
            komut.Parameters.Clear();
            baglanti.Open();
            komut = new MySqlCommand("INSERT INTO usersessions(SessionKey,UserId,UserMail,Date,SessionIp,Status) VALUES (@SessionKey,@userid,@usermail,@date,@SessionIp,@Status)", baglanti);
            komut.Parameters.Add("@SessionKey", sessionkey);
            komut.Parameters.Add("@userid", userid);
            komut.Parameters.Add("@usermail", mail);
            komut.Parameters.Add("@date", date);
            komut.Parameters.Add("@SessionIp", userip);
            komut.Parameters.Add("@Status", true);
            komut.ExecuteReader();
            komut.Dispose();
            baglanti.Dispose();
            baglanti.Close();


            HttpCookie session = HttpContext.Current.Response.Cookies["session"];
            if (session == null) session = new HttpCookie("session");
            session.Value = sessionkey;
            HttpContext.Current.Response.Cookies.Add(session);
            return "1";
        }
    }

    public int islogin()
    {
        string session = HttpContext.Current.Request["session"];
        string tempstatus = SatirBilgileriGetir("UserId", "usersessions", "where SessionKey='" + session + "' and Status=1");
        int status = 0;
        if (tempstatus != "" && tempstatus != null)
        {
            status = Convert.ToInt32(tempstatus.ToString());
        }
        return status;
    }

    public string getuserdetail(string param)
    {
        param = fix(param);
        return SatirBilgileriGetir(param, "uye", "Where UyeID=" + islogin());
    }


    public DataTable getdt(string table, string command, string from = "*")
    {
        MySqlDataAdapter da = new MySqlDataAdapter("select " + from + " from " + table + " " + command, baglanti);
        DataTable dt = new DataTable();
        da.Fill(dt);

        return dt;
    }



    public bool TestEmailRegex(string emailAddress) { string patternStrict = @"\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*"; Regex reStrict = new Regex(patternStrict); bool isStrictMatch = reStrict.IsMatch(emailAddress); return isStrictMatch; }
    public bool TestSpecialCharacters(string veri) { string patternStrict = @"^\s*([0-9a-zA-Z]+)\s*$"; Regex reStrict = new Regex(patternStrict); bool isStrictMatch = reStrict.IsMatch(veri); return isStrictMatch; }
    public bool TestOnlyNumbers(string veri) { string patternStrict = @"^\s*([0-9]+)\s*$"; Regex reStrict = new Regex(patternStrict); bool isStrictMatch = reStrict.IsMatch(veri); return isStrictMatch; }
    public bool isDecimal(string veri) { string patternStrict = @"^\s*([0-9.]+)\s*$"; Regex reStrict = new Regex(patternStrict); bool isStrictMatch = reStrict.IsMatch(veri); return isStrictMatch; }
    public string isImageFile(FileUpload flup1)
    {
        if (!flup1.HasFile) return "dosyayok";
        string ret = "";
        string isim = "";
        var ext = Path.GetExtension(flup1.PostedFile.FileName).Substring(1);
        string node = Guid.NewGuid().ToString().Replace("-", "");
        isim = node + "." + ext;
        ret = isim;
        if (ext != "jpg" && ext != "png" && ext != "JPG" && ext != "jpeg" && ext != "JPEG" && ext != "PNG")
        {
            ret = "gecersiz";
        }

        return ret;
    }




    private string XMLPOST(string PostAddress, string xmlData)
    {
        try
        {
            var res = "";
            byte[] bytes = Encoding.UTF8.GetBytes(xmlData);
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create(PostAddress);

            request.Method = "POST";
            request.ContentLength = bytes.Length;
            request.ContentType = "text/xml";
            request.Timeout = 300000000;
            using (Stream requestStream = request.GetRequestStream())
            {
                requestStream.Write(bytes, 0, bytes.Length);
            }

            using (HttpWebResponse response = (HttpWebResponse)request.GetResponse())
            {
                if (response.StatusCode != HttpStatusCode.OK)
                {
                    string message = String.Format(
                    "POST failed. Received HTTP {0}",
                    response.StatusCode);
                    throw new ApplicationException(message);
                }

                Stream responseStream = response.GetResponseStream();
                using (StreamReader rdr = new StreamReader(responseStream))
                {
                    res = rdr.ReadToEnd();
                }
                return res;
            }
        }
        catch (Exception e)
        {

            return e.Message;
        }
    }

    private bool smsgonder(string numara, string mesaj)
    {
        String testXml = "<request>";
        testXml += "<authentication>";
        testXml += "<username>5065979313</username>";
        testXml += "<password>sms@emreyildiz</password>";
        testXml += "</authentication>";
        testXml += "<order>";
        testXml += "<sender>ti-shop</sender>";
        testXml += "<sendDateTime></sendDateTime>";
        testXml += "<message>";
        testXml += "<text>" + mesaj + "</text>";
        testXml += "<receipents>";
        testXml += "<number>" + numara + "</number>";
        testXml += "</receipents>";
        testXml += "</message>";
        testXml += "</order>";
        testXml += "</request>";

        try
        {

            this.XMLPOST("http://api.yazarge.com/v1/send-sms/", testXml);
            return true;
        }
        catch (Exception)
        {
            return false;
        }

        return true;
    }



    public string htmluret(string degistir)
    {

        degistir = degistir.ToLower();
        degistir = degistir.Replace(".", string.Empty);
        degistir = degistir.Replace('?', '-');
        degistir = degistir.Replace('+', '-');
        degistir = degistir.Replace('*', '-');
        degistir = degistir.Replace('#', '-');
        degistir = degistir.Replace(',', '-');
        degistir = degistir.Replace('/', '-');
        degistir = degistir.Replace(';', '-');
        degistir = degistir.Replace(':', '-');
        degistir = degistir.Replace(' ', '-');
        degistir = degistir.Replace(')', '-');
        degistir = degistir.Replace('(', '-');
        degistir = degistir.Replace('<', '-');
        degistir = degistir.Replace('>', '-');
        degistir = degistir.Replace('"', '-');
        degistir = fix(degistir);
        degistir = degistir.Replace('ç', 'c');
        degistir = degistir.Replace('ğ', 'g');
        degistir = degistir.Replace('ı', 'i');
        degistir = degistir.Replace('ö', 'o');
        degistir = degistir.Replace('ş', 's');
        degistir = degistir.Replace('ü', 'u');
        degistir = degistir.Replace('Ç', 'C');
        degistir = degistir.Replace('Ğ', 'G');
        degistir = degistir.Replace('İ', 'i');
        degistir = degistir.Replace('Ö', 'O');
        degistir = degistir.Replace('Ş', 'S');
        degistir = degistir.Replace('Ü', 'U');

        degistir = degistir.ToLower();
        return degistir;
    }


    public string etiketler(int pageid)
    {
        DataTable dt = getdt("etiket", "Where Id=" + pageid);
        string metin = "";
        for (int i = 0; i < dt.Rows.Count; i++)
        {
            metin += dt.Rows[i]["Etiket"] + ",";
        }
        return metin;
    }


    public void etiketleriekle(int id, string veri)
    {
        veri = fix(veri);
        string[] arr = veri.Split(',');
        for (int i = 0; i < arr.Length; i++)
        {
            etiketiekle(arr[i], id);
        }

    }

    public void etiketiekle(string etiket, int id)
    {
        int count = 0;
        try
        {
            count = counttable("etiket", "Where Id=" + id + " AND Etiket='" + etiket + "'");
            if (count == 0)
            {
                List<string> columns = new List<string> { "Id", "Etiket" };
                List<string> values = new List<string> { id.ToString(), etiket };
                inored("etiket", "EtiketId", 0, columns, values, false);
            }
        }
        catch (Exception)
        {
        }
    }


    public void altdosyalarikopyala(int id, int sourceid)
    {
        komut.CommandText = "INSERT INTO files(AlbumId,Tur,Ext,FileTitle,FileUrl,CreatedDate,Date) SELECT " + id + ",Tur,Ext,FileTitle,FileUrl,CreatedDate,Date FROM files WHERE AlbumId=" + sourceid;
        komut.Connection = baglanti;
        baglanti.Open();
        komut.ExecuteNonQuery();
    }



    public void seo(string title = "", string fbpicture = "")
    {
        DataTable dt = getdt("options", "Order by OptionId limit 0,3");
        string baslik = dt.Rows[0]["OptionValue"].ToString();
        string aciklama = dt.Rows[1]["OptionValue"].ToString();
        string etiket = dt.Rows[2]["OptionValue"].ToString();


        var page = (Page)HttpContext.Current.Handler;

        baslik = (title == "") ? baslik : title + " | " + baslik;
        aciklama = shortingletter(fix(aciklama), 140, "...");

        page.Title += baslik;
        var keywords = new HtmlMeta { Name = "keywords", Content = etiket };
        page.Header.Controls.Add(keywords);

        var description = new HtmlMeta { Name = "description", Content = aciklama };
        page.Header.Controls.Add(description);

        //facebook için
        var fbtitle = new HtmlMeta();
        fbtitle.Attributes.Add("property", "og:title");
        fbtitle.Content = baslik;
        page.Header.Controls.Add(fbtitle);


        var fbdescription = new HtmlMeta();
        fbdescription.Attributes.Add("property", "og:description");
        fbdescription.Content = aciklama;
        page.Header.Controls.Add(fbdescription);


        var fbimage = new HtmlMeta();
        fbimage.Attributes.Add("property", "og:image");
        fbimage.Content = "http://yazarge.com/Dosyalar/buyuk/" + fbpicture;
        page.Header.Controls.Add(fbimage);

        string url = "http://" + HttpContext.Current.Request.Url.Authority + HttpContext.Current.Request.RawUrl;
        var fburl = new HtmlMeta();
        fburl.Attributes.Add("property", "og:url");
        fburl.Content = url;
        page.Header.Controls.Add(fburl);

    }




}

#line default
#line hidden
