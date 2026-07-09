#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\types.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "522381F85046A8A8BC13DADDF7D6F97F39AC8D9C"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\types.aspx.cs"
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
        rptUrunler.DataSource = sf.getdt("type", "");
        rptUrunler.DataBind();

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
