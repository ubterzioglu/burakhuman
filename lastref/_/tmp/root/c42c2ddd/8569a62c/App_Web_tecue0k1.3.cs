#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\login.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "E1F83CF5EBA591ECD534347F5A02B157E3206BB8"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\login.aspx.cs"
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data.MySqlClient;

public partial class Admin_login : System.Web.UI.Page
{

    MySqlConnection baglanti = new MySqlConnection(ConfigurationManager.ConnectionStrings["connStr"].ConnectionString);
    MySqlCommand komut = new MySqlCommand();
    MySqlDataReader dr;
    sayfa sf = new sayfa();

    protected void Page_Load(object sender, EventArgs e)
    {
        string returnurl = Request.Url.ToString();
        string siteurl = Request.Url.GetLeftPart(UriPartial.Authority);
        returnurl = returnurl.Replace(siteurl, string.Empty);
        if (sf.GetAdminId() != 0) Response.Redirect(returnurl);
    }
    protected void Button1_Click(object sender, EventArgs e)
    {


        string kadi = txtUser.Text;
        string ksifre = txtSifre.Text;

        if (sf.adminlogin(kadi, ksifre) == "1")
        {
            string returnurl = "";
            if (Request["return"] != null)
            {
                returnurl = Request["return"];
            }
            else
            {
                returnurl = "anasayfa";
            }
            Response.Redirect(returnurl);
        }

        else
        {
            lbl1.Visible = true;
        }
        
    }
}

#line default
#line hidden
