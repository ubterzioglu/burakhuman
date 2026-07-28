#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\logout.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "E53564E2D9680F6A8D6010BF266429318666B5B5"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\logout.aspx.cs"
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
        session.Value = null;
        HttpContext.Current.Response.Cookies.Add(session);
        Response.Redirect("default.aspx");
    }

}

#line default
#line hidden
