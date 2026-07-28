#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\kategori.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "2690EAD704F90D57ABDC1129A09F20F1DC290B6E"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\kategori.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using System.Data;

public partial class Admin_Default2 : System.Web.UI.Page
{
    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        tipler();
        try
        {
            int x = Convert.ToInt32(Request["id"]);
            if (x > 0 && !IsPostBack)
            {
                DataTable dt = sf.getdt("categories", "Where CatId=" + x);
                txtAd.Text = dt.Rows[0]["CatName"].ToString();
                drpTypes.SelectedValue = dt.Rows[0]["TypeId"].ToString();
            }

            else
            {

                int type = Convert.ToInt32(Request["type"]);
                drpTypes.SelectedValue = type.ToString();
            }
        }
        catch (Exception)
        {
            Response.Redirect("default.aspx");
        }
    }


    public void tipler()
    {
        DataTable dt = sf.getdt("type", "Where Categories=1");
        drpTypes.DataTextField = "TypeName";
        drpTypes.DataValueField = "TypeId";
        drpTypes.DataSource = dt;
        drpTypes.DataBind();

        drpTypes.Items.Insert(0, new ListItem("Tip Seçiniz", "0"));
        int i = Convert.ToInt32(drpTypes.SelectedValue);
    }

    protected void btnGonder_Click(object sender, EventArgs e)
    {
        string kategoriad = sf.fix(txtAd.Text);
        DateTime tarih = DateTime.Now;
        int id = Convert.ToInt32(Request["id"]);
        string type = drpTypes.SelectedValue;

        string isim = sf.isImageFile(fl1);
        Boolean hata = false;

        if (kategoriad == "")
        {
            hata = true;
            pnlAlert.Visible = true;
            lblHata.Text = "Kategori adı boş olamaz";
        }
 
        else if (isim == "gecersiz") { hata = true; pnlAlert.Visible = true; lblHata.Text = fl1.PostedFile.FileName + " adlı dosyanın formatı uygun değil. Lütfen jpg ya da png yükleyiniz. </br>"; }

        else if(!hata)
        {
            List<String> columns = new List<string>() { "CatName","TypeId"};
            List<String> values = new List<string>() { kategoriad, type};

            List<string> paths = new List<string>() { "thumb", "kucuk", "orta", "buyuk" };
            List<int> pvalues = new List<int>() { 150, 320, 640, 960 };

            sf.fotografkaydet(isim, fl1, paths, pvalues, true);

            if (id > 0) sf.deletefile("pages", "Where PageId=" + id);
            columns.Add("PictureUrl");
            values.Add(isim);

            sf.inored("categories", "CatId", id, columns, values, false);
            Response.Redirect("kategoriler.aspx?added=true&type="+type);
        }

    }
}

#line default
#line hidden
