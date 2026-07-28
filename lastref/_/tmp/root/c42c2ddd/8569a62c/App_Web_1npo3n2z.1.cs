#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\icerikler.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "BE3F9DB88C0EF6739F060D6670073F851D4E328C"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\icerikler.aspx.cs"
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

    public Boolean _subimages = false, _subfiles = false,_languages=false,_protected=false, _categories;

    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            int type = 0;
            int cat = 0;
            string command = "";
            string lang = "";
            try
            {
                type = Convert.ToInt32(Request["type"].ToString());
                if (sf.counttable("type", "Where TypeId=" + type) == 0) Response.Redirect("default.aspx");

                command = "Where TypeId=" + type;
                kategoriler(type);
                ozellikler(type);
                diller();

                try
                {

                    lang = sf.fix(Request["lang"].ToString());
                    drpDiller.SelectedValue = lang.ToString();
                    command += (drpDiller.SelectedValue == "") ? "" :" AND Lang='"+drpDiller.SelectedValue+"'";

                    cat = Convert.ToInt32(Request["cat"].ToString());
                    if (cat > 0)
                    {
                        command += " AND CatId=" + cat;
                        drpKategoriler.SelectedValue = Request["cat"].ToString();
                    }
                }
                catch (Exception)
                {
                }
            }
            catch (Exception er)
            {
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

    public void diller()
    {
        DataTable dt = sf.getdt("languages", "");
        drpDiller.DataTextField = "LangName";
        drpDiller.DataValueField ="LangValue";
        drpDiller.DataSource = dt;
        drpDiller.DataBind();

        drpDiller.Items.Insert(0, new ListItem("Tüm Dil Seçenekleri", ""));
        drpDiller.Items.Insert(1, new ListItem("Türkçe", "tr"));
    }


    public void icerikler(string command)
    {
        rptIcerikler.DataSource = sf.getdt("pages", command+" Order by rank asc,lang desc");
        rptIcerikler.DataBind();
    }

    public void ozellikler(int type)
    {
        DataTable dt = sf.getdt("type", "Where TypeId=" + type);

        _subimages = (dt.Rows[0]["SubImages"].ToString() == "True") ? true : false;
        _subfiles = (dt.Rows[0]["SubFiles"].ToString() == "True") ? true : false;
        _categories = (dt.Rows[0]["Categories"].ToString() == "True") ? true : false;
        _protected = (dt.Rows[0]["Protected"].ToString() == "True") ? true : false;

        int x = sf.counttable("languages", "");
        if (x != 0) _languages = true;
    }

    public void kategoriler(int type)
    {
        DataTable dt = sf.getdt("categories", "Where TypeId=" + type);
        drpKategoriler.DataTextField = "CatName";
        drpKategoriler.DataValueField = "CatId";
        drpKategoriler.DataSource = dt;
        drpKategoriler.DataBind();

        drpKategoriler.Items.Insert(0, new ListItem("Tümünü Göster", "0"));
    }



    protected void drpKategoriler_SelectedIndexChanged(object sender, EventArgs e)
    {
        int type = Convert.ToInt32(Request["type"].ToString());
        int i = Convert.ToInt32(drpKategoriler.SelectedValue);
        string lang = drpDiller.SelectedValue;
        Response.Redirect("icerikler?type=" + type + "&cat=" + i + "&lang=" + lang);
    }

    protected void DropDownList1_SelectedIndexChanged(object sender, EventArgs e)
    {
        int type = Convert.ToInt32(Request["type"].ToString());
        int i = Convert.ToInt32(drpKategoriler.SelectedValue);
        string lang = drpDiller.SelectedValue;
        Response.Redirect("icerikler?type=" + type + "&cat=" + i+"&lang="+lang);
    }
}

#line default
#line hidden
