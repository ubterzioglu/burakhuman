#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\Default.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "6084E1DCF54AECD8E5F4263E52C30DC6548C622A"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\Default.aspx.cs"
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
        if (!IsPostBack)
        {
           
            string dun = DateTime.Now.AddDays(-1).ToString("yyyy-MM-dd");

            string bugun = DateTime.Now.ToString("yyyy-MM-dd");

            

        }

       
    }
    protected void TextBox1_TextChanged(object sender, EventArgs e)
    {
       
    }
    protected void ImageButton1_Click(object sender, ImageClickEventArgs e)
    {
        try
        {
            string[] kod;

            kod = TextBox1.Text.Split('T');
            Search(Convert.ToInt32(kod[1]));
        }
        catch
        {
        }
    }
    public void Search(int kod)
    {
        Response.Redirect("_siparisKntrl.aspx?id="+kod);

    }

}

#line default
#line hidden
