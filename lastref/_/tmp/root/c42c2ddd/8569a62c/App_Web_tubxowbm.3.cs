#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\mesajlar.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "00FAF6BF30260DD9C43C7627065A70E8CFE31E89"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\mesajlar.aspx.cs"
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
        if (Request["deleted"] != null)
        {
            pnlDelete.Visible = true;
        }
        int id = Convert.ToInt32(Request["id"]);
        rptUrunler.DataSource = sf.getdt("messages","");
        rptUrunler.DataBind();
    }
}

#line default
#line hidden
