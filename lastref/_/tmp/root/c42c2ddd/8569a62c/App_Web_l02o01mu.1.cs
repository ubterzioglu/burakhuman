#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\uyeler.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "878400B9BBE227BA3807060A49FD0BF5108CD8ED"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\uyeler.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data.MySqlClient;
using System.Configuration;

public partial class Admin_Default : System.Web.UI.Page
{
    MySqlConnection baglanti = new MySqlConnection(ConfigurationManager.ConnectionStrings["connStr"].ConnectionString);
    MySqlCommand komut = new MySqlCommand();
    MySqlDataReader dr;

    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        rptUrunler.DataSource = sf.getdt("uye", "Order by UyeId");
        rptUrunler.DataBind();

        if (Request["onay"] != null)
        {
            pnlAdded.Visible = true;
        }

    }
}

#line default
#line hidden
