#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\ayar.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "2057806D10B6F79BA9234046FC0705DDC7C30A8A"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\ayar.aspx.cs"
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
    public string _map = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        rptUrunler.DataSource = sf.getdt("options", "Order by OptionId");
        rptUrunler.DataBind();
        _map = sf.SatirBilgileriGetir("OptionValue", "options", "Where OptionName='map'");
        _map = (_map == "") ? "(40.76438730181487, 29.96136068334954)" : _map;

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
