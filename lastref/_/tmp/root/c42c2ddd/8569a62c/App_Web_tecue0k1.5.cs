#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\logout.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "BD112534682236E45C8CC65110A6ECAC59C59B4D"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\logout.aspx.cs"
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Default2 : System.Web.UI.Page
{
    MySqlConnection baglanti = new MySqlConnection(ConfigurationManager.ConnectionStrings["connStr"].ConnectionString);
    MySqlCommand komut = new MySqlCommand();
    MySqlDataReader dr;
    sayfa sf = new sayfa();

    protected void Page_Load(object sender, EventArgs e)
    {
        HttpCookie session = HttpContext.Current.Response.Cookies["session"];
        if (session == null) session = new HttpCookie("session");
        session.Value = "";
        HttpContext.Current.Response.Cookies.Add(session);
        Response.Redirect("login");
    }

}

#line default
#line hidden
