#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\hesaplar.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "24A72505FD602877763FF6A8FBFAF4A4D37836BE"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\hesaplar.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data.MySqlClient;
using System.Configuration;

public partial class Admin_Default2 : System.Web.UI.Page
{
    MySqlConnection baglanti = new MySqlConnection(ConfigurationManager.ConnectionStrings["connStr"].ConnectionString);
    MySqlCommand komut = new MySqlCommand();
    MySqlDataReader dr;

    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        rptArea.DataSource = sf.getdt("hesaplar", "");
        rptArea.DataBind();

        if (Request["deleted"] != null)
        {
            pnlDelete.Visible = true;
            pnlAdded.Visible = false;
        }

        else if (Request["added"] != null)
        {
            pnlAdded.Visible = true;
        }
    }
}

#line default
#line hidden
