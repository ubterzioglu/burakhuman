#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\kategoriler.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "3F655BCF4BF6DB703F17ADA2C7DC0BE8E27B1906"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\kategoriler.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data.MySqlClient;
using System.Configuration;
using System.Data;

public partial class Admin_Default : System.Web.UI.Page
{
    MySqlConnection baglanti = new MySqlConnection(ConfigurationManager.ConnectionStrings["connStr"].ConnectionString);
    MySqlCommand komut = new MySqlCommand();
    MySqlDataReader dr;

    sayfa sf = new sayfa();

    public Boolean _subimages = false, _subfiles = false, _categories;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            int type = 0;
            int cat = 0;
            string command = "";
            try
            {
               
                tipler();

                try
                {
                    type = Convert.ToInt32(Request["type"].ToString());
                    if (type > 0)
                    {
                        command += "Where TypeId=" + type;
                        drpKategoriler.SelectedValue = type.ToString();
                    }
                }
                catch (Exception)
                {
                }
            }
            catch (Exception er)
            {
                Response.Write(er.Message);
            }

            icerikler(command);
        }

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


    public void icerikler(string command)
    {
        rptUrunler.DataSource = sf.getdt("categories", command);
        rptUrunler.DataBind();
    }


    public void tipler()
    {
        DataTable dt = sf.getdt("type", "Where Categories=1");
        drpKategoriler.DataTextField = "TypeName";
        drpKategoriler.DataValueField = "TypeId";
        drpKategoriler.DataSource = dt;
        drpKategoriler.DataBind();

        drpKategoriler.Items.Insert(0, new ListItem("Tip Seçiniz", "0"));
        int i = Convert.ToInt32(drpKategoriler.SelectedValue);
    }



    protected void drpKategoriler_SelectedIndexChanged(object sender, EventArgs e)
    {
        int i = Convert.ToInt32(drpKategoriler.SelectedValue);
        Response.Redirect("kategoriler?type=" + i);
    }

}

#line default
#line hidden
