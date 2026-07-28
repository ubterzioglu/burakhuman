#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\type.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "6607DEDD1F6D7AF2043121FE9B115EAE6C72F9E7"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\type.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MySql.Data.MySqlClient;
using System.Configuration;
using System.IO;
using System.Collections;
using System.Data;

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

            int x = Convert.ToInt32(Request["id"]);
            if (x > 0) Goster(x);

        }
    }

    public void Goster(int x)
    {
        DataTable dt = sf.getdt("type", "Where TypeId=" + x);
        txtTypeAd.Text = dt.Rows[0]["TypeName"].ToString();
        txtBaslik.Text = dt.Rows[0]["Title"].ToString();
        txtOzet.Text = dt.Rows[0]["Summary"].ToString();
        txtIcerik.Text = dt.Rows[0]["Text"].ToString();
        txtChck1.Text = dt.Rows[0]["Chck1"].ToString();
        txtChck2.Text = dt.Rows[0]["Chck2"].ToString();
        txtVal1.Text = dt.Rows[0]["Val1"].ToString();
        txtVal2.Text = dt.Rows[0]["Val2"].ToString();
        txtVal3.Text = dt.Rows[0]["Val3"].ToString();
        txtVal4.Text = dt.Rows[0]["Val4"].ToString();
        txtVal5.Text = dt.Rows[0]["Val5"].ToString();
        txtVal6.Text = dt.Rows[0]["Val6"].ToString();
        txtVal7.Text = dt.Rows[0]["Val7"].ToString();
        chckCoverPhoto.Checked = (dt.Rows[0]["PictureUrl"].ToString() == "True") ? true : false;
        chckSubImages.Checked = (dt.Rows[0]["SubImages"].ToString() == "True") ? true : false;
        chckSubFiles.Checked = (dt.Rows[0]["SubFiles"].ToString() == "True") ? true : false;
        chckCategories.Checked = (dt.Rows[0]["Categories"].ToString() == "True") ? true : false;
        chckEtiket.Checked = (dt.Rows[0]["Tags"].ToString() == "True") ? true : false;
        chckProtected.Checked = (dt.Rows[0]["Protected"].ToString() == "True") ? true : false;

    }

    protected void btnGonder_Click(object sender, EventArgs e)
    {

        int id = Convert.ToInt32(Request["id"]);

        string typename = sf.fix(txtTypeAd.Text);
        string title = sf.fix(txtBaslik.Text);
        string summary = sf.fix(txtOzet.Text);
        string text = sf.fix(txtIcerik.Text);
        string chck1 = sf.fix(txtChck1.Text);
        string chck2 = sf.fix(txtChck2.Text);
        string val1 = sf.fix(txtVal1.Text);
        string val2 = sf.fix(txtVal2.Text);
        string val3 = sf.fix(txtVal3.Text);
        string val4 = sf.fix(txtVal4.Text);
        string val5 = sf.fix(txtVal5.Text);
        string val6 = sf.fix(txtVal6.Text);
        string val7 = sf.fix(txtVal7.Text);
        int pictureurl = (chckCoverPhoto.Checked) ? 1 : 0;
        int subimages = (chckSubImages.Checked) ? 1 : 0;
        int subfiles = (chckSubFiles.Checked) ? 1 : 0;
        int categories = (chckCategories.Checked) ? 1 : 0;
        int tags = (chckEtiket.Checked) ? 1 : 0;
        int isprotected = (chckProtected.Checked) ? 1 : 0;

        Boolean hata = false;

        if (typename == "")
        {
            pnlAlert.Visible = true;
            lblHata.Text = "Tip adı boş olamaz";
            hata = true;
        }


        if (!hata)
        {
            List<String> columns = new List<string>() { "TypeName", "Title", "Summary", "Text", "Chck1", "Chck2", "Val1", "Val2", "Val3", "Val4", "Val5", "Val6", "Val7", "PictureUrl", "SubImages", "SubFiles", "Categories", "Tags","Protected" };
            List<String> values = new List<string>() { typename, title, summary, text, chck1, chck2, val1, val2, val3, val4, val5, val6, val7, pictureurl.ToString(), subimages.ToString(), subfiles.ToString(), categories.ToString(), tags.ToString(),isprotected.ToString() };



            string retid = sf.inored("type", "TypeId", id, columns, values, false);
            Response.Redirect("types?added=true");
        }

    }




}

#line default
#line hidden
