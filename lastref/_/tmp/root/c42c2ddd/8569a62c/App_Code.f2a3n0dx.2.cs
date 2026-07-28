#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\App_Code\ws.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "54FEA925419E4E01369D2929313952D53CFB4958"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\App_Code\ws.cs"
using System;
using System.Collections;
using System.Linq;
using System.Web;
using System.Web.Services;
using System.Web.Services.Protocols;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using System.Xml.Linq;
using System.Xml;
using System.Xml.XPath;
using System.IO;
using System.Web.Script.Services;
using MySql.Data.MySqlClient;
using System.Configuration;
using MySql.Web.SessionState;
using System.Text.RegularExpressions;
using System.Net.Mail;
using System.Collections.Generic;
using System.Text;
using System.Data;
using Newtonsoft.Json;

[System.Web.Script.Services.ScriptService]
[WebService(Namespace = "http://yazinca.com")]
public class ws : System.Web.Services.WebService
{
    MySqlConnection baglanti = new MySqlConnection(ConfigurationManager.ConnectionStrings["connStr"].ConnectionString);
    MySqlCommand komut = new MySqlCommand();
    MySqlDataReader dr;
    sayfa sf = new sayfa();



    [WebMethod(EnableSession = true)]
    public int GetAdminId()
    {
        string session = HttpContext.Current.Request["session"];
        session = sf.fix(session);
        string tempstatus = sf.SatirBilgileriGetir("AdminId", "adminsessions", "where SessionKey='" + session + "' and Status=1");
        int status = 0;
        if (tempstatus != "" && tempstatus != null)
        {
            status = Convert.ToInt32(tempstatus.ToString());
        }
        return status;
    }

    public ws()
    {
    }

    [WebMethod(EnableSession = true)]
    public string editoption(string OptionName, string OptionValue)
    {
        if (GetAdminId() != 0)
        {
            int x = sf.counttable("options", "Where OptionName='" + OptionName + "'");
            if (x > 0)
            {
                try
                {
                    komut.CommandText = "Update options set OptionValue=@OptionValue where OptionName=@OptionName";
                    komut.Connection = baglanti;
                    komut.Parameters.AddWithValue("@OptionName", sf.fix(OptionName));
                    komut.Parameters.AddWithValue("@OptionValue", sf.fix(OptionValue));
                    baglanti.Open();
                    komut.ExecuteNonQuery();
                    baglanti.Close();
                    return "1";
                }
                catch (Exception)
                {
                    return "0";
                }


            }
        }
        return "0";
    }


    [WebMethod(EnableSession = true)]
    public string etiketsil(string Id, string Etiket)
    {
        string ret = "0";
        if (GetAdminId() != 0)
        {
            try
            {
                komut.CommandText = "delete from etiket Where Id=" + Id + " AND Etiket='" + Etiket + "'";
                komut.Connection = baglanti;
                baglanti.Open();
                komut.ExecuteNonQuery();
                baglanti.Close();
                ret = "1";
            }
            catch (Exception)
            {
                ret = "0";
            }
        }
        return ret;
    }



    [WebMethod(EnableSession = true)]
    public string satirsil(string sutun, string command)
    {
        if (GetAdminId() != 0)
        {
            try
            {
                sf.deletefile(sutun, command);

                komut.CommandText = "delete from " + sutun + " " + command;
                komut.Connection = baglanti;
                baglanti.Open();
                komut.ExecuteNonQuery();
                baglanti.Close();

                return "1";
            }
            catch (Exception)
            {
                return "0";
            }
        }
        return "0";
    }



    [WebMethod(EnableSession = true)]
    public string logging(string pagename, string logdetail, string logprocess)
    {
        DateTime tarih = DateTime.Now;
        int userid = GetAdminId();
        if (GetAdminId() != 0)
        {
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
        return "1";
    }



    [WebMethod(EnableSession = true)]
    public string userlogin(string UserMail, string UserPassword)
    {

        if (islogin() != 0) return "0";

        string userip = HttpContext.Current.Request.UserHostAddress;
        string usermail = sf.fix(UserMail);
        string userpassword = sf.fix(UserPassword);
        string userid = sf.SatirBilgileriGetir("UyeId", "uye", "where Status=1 and MailAdres='" + usermail + "' and Sifre='" + userpassword + "'");

        if (userid == null) return "0";
        else
        {
            string sessionkey = Guid.NewGuid().ToString().Replace("-", string.Empty);
            DateTime date = DateTime.Now;
            baglanti.Open();
            komut = new MySqlCommand("INSERT INTO usersessions(SessionKey,UserId,UserMail,Date,SessionIp,Status) VALUES (@SessionKey,@userid,@usermail,@date,@SessionIp,@Status)", baglanti);
            komut.Parameters.Add("@SessionKey", sessionkey);
            komut.Parameters.Add("@userid", userid);
            komut.Parameters.Add("@usermail", usermail);
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


    [WebMethod(EnableSession = true)]
    public int islogin()
    {
        string session = HttpContext.Current.Request["session"];
        string tempstatus = sf.SatirBilgileriGetir("UserId", "usersessions", "where SessionKey='" + session + "' and Status=1");
        int status = 0;
        if (tempstatus != "" && tempstatus != null)
        {
            status = Convert.ToInt32(tempstatus.ToString());
        }
        return status;
    }



    [WebMethod(EnableSession = true)]
    public string FormGonder(string konu, string mesaj, string mailto, string ad = "", string tel = "", string gonderen = "")
    {
        try
        {
            konu = sf.fix(konu);
            mesaj = sf.fix(mesaj);
            mesaj = mesaj.Replace("\n", "<br>");

            List<string> columns = new List<string> { "Name", "Telephone", "MailAdress", "Subject", "Message" };
            List<string> values = new List<string> { ad, tel, gonderen, konu, mesaj };

            sf.inored("messages", "MessageId", 0, columns, values, true);
            sf.SendMail(konu, mesaj, mailto);
            return "true";
        }
        catch (Exception)
        {
            return "false";
        }
    }


    [WebMethod(EnableSession = true)]
    public string MailEkle(string mail)
    {
        try
        {
            mail = sf.fix(mail);
            int cnt = sf.counttable("maillist", "Where MailAdress='" + mail + "'");
            if (cnt != 0) return "Mail adresiniz daha önce sistemimize kaydedilmiştir.";
            else
            {
                List<string> columns = new List<string> { "MailAdress" };
                List<string> values = new List<string> { mail };

                sf.inored("maillist", "MailId", 0, columns, values, false);
                return "Mailiniz başarıyla kaydedildi.";
            }
        }
        catch (Exception)
        {
            return "Bir hata oluştu, sisteme iletilmiştir.";
        }

    }


    [WebMethod(EnableSession = true)]
    public void dosyasirakaydet(int id, int konum)
    {
        if (GetAdminId() != 0)
        {
            try
            {
                komut.CommandText = "Update files set rank=@rank where FileId=@FileId";
                komut.Connection = baglanti;
                komut.Parameters.AddWithValue("@rank", konum);
                komut.Parameters.AddWithValue("@FileId", id);
                baglanti.Open();
                komut.ExecuteNonQuery();
                baglanti.Close();
            }
            catch (Exception)
            {
                baglanti.Close();
            }
        }
    }


    [WebMethod(EnableSession = true)]
    public void iceriksirakaydet(int id, int konum)
    {
        if (GetAdminId() != 0)
        {
            try
            {
                komut.CommandText = "Update pages set rank=@rank where PageId=@PageId";
                komut.Connection = baglanti;
                komut.Parameters.AddWithValue("@rank", konum);
                komut.Parameters.AddWithValue("@PageId", id);
                baglanti.Open();
                komut.ExecuteNonQuery();
                baglanti.Close();
            }
            catch (Exception)
            {
                baglanti.Close();
            }
        }
    }



    [WebMethod(EnableSession = true)]
    public string GetReferences(int start=0,int length=10,int CatId=0)
    {
        string lang = "tr";
        string responseText = "";
        string kategorikomut = (CatId == 0) ? "" : "AND p.CaTId=" + CatId;
        try
        {
            DataTable dt = sf.getdt("pages as p LEFT JOIN categories as c ON p.CatId=c.CatId RIGHT JOIN (select FileUrl,AlbumId,min(rank) from files GROUP BY AlbumId) as f ON p.PageId = f.AlbumId", "Where p.TypeId=1 "+kategorikomut+" AND lang='" + lang + "' order by p.rank limit " + start + "," + length,"p.PageId,p.PageTitle,c.CatId,p.PageSummary,p.PictureUrl,p.rank,f.FileUrl");
            int count = dt.Rows.Count;
            if (count > 0) responseText = JsonConvert.SerializeObject(dt);
            else responseText = "null";
        }
        catch (Exception)
        {
            responseText = "null";
        }
        return responseText;
    }
}


#line default
#line hidden
