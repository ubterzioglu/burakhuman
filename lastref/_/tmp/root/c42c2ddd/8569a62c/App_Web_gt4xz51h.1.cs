#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\icerik.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "13AE8B239788424CCA01D139EDD29FC2CF4BF452"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\icerik.aspx.cs"
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

    public Boolean _picture = false, _kategori = false, _etiketler = false;

    public string _title = "", _summary = "", _text = "", _chck1 = "", _chck2 = "", _val1 = "", _val2 = "", _val3 = "", _val4 = "", _val5 = ""
        , _val6 = "",_val7="";


    protected void Page_Load(object sender, EventArgs e)
    {
        int type = 0;
        int cat = 0;
        string lang = "";
        if (!IsPostBack)
        {
            try
            {
                type = Convert.ToInt32(Request["type"].ToString());
                ozellikler(type);
                kategoriler(type);
            }
            catch (Exception)
            {
            }



            diller();
            int x = Convert.ToInt32(Request["id"]);
            if (x > 0) Goster(x);
            else
            {
                int sourceid = (sf.counttable("pages", "Where PageId=" + (Convert.ToInt32(Request["sourceid"]))) == 0) ? 0 : (Convert.ToInt32(Request["sourceid"]));
                if (sourceid > 0) Goster(sourceid);
            }

            string command = "";
            try
            {
                if (x == 0 && sf.counttable("type", "Where TypeId=" + type) == 0) Response.Redirect("default.aspx");
                if (x > 0 && sf.counttable("pages", "Where TypeId=" + type + " AND PageId=" + x) == 0) Response.Redirect("default.aspx");


                try
                {

                    lang = Request["lang"].ToString();
                    drpDiller.SelectedValue = lang.ToString();

                    cat = Convert.ToInt32(Request["cat"].ToString());
                    if (cat > 0)
                    {
                        drpKategoriler.SelectedValue = cat.ToString();
                    }

                }
                catch (Exception)
                {
                }
            }
            catch (Exception er)
            {
            }
        }

    }


    public void ozellikler(int type)
    {
        DataTable dt = sf.getdt("type", "Where TypeId=" + type);

        _picture = (dt.Rows[0]["PictureUrl"].ToString() == "True") ? true : false;
        if (!_picture) pnlPicture.Visible = false;

        _etiketler = (dt.Rows[0]["Tags"].ToString() == "True") ? true : false;
        if (!_etiketler) pnlEtiketler.Visible = false;

        _kategori = (dt.Rows[0]["Categories"].ToString() == "True") ? true : false;
        if (!_kategori) pnlKategori.Visible = false;

        _title = dt.Rows[0]["Title"].ToString();
        if (_title.ToString().Length == 0) pnlTitle.Visible = false;

        _summary = dt.Rows[0]["Summary"].ToString();
        if (_summary.ToString().Length == 0) pnlSummary.Visible = false;

        _text = dt.Rows[0]["Text"].ToString();
        if (_text.ToString().Length == 0) pnlText.Visible = false;

        _chck1 = dt.Rows[0]["Chck1"].ToString();
        if (_chck1.ToString().Length == 0) pnlChck1.Visible = false;

        _chck2 = dt.Rows[0]["Chck2"].ToString();
        if (_chck2.ToString().Length == 0) pnlChck2.Visible = false;

        _val1 = dt.Rows[0]["Val1"].ToString();
        if (_val1.ToString().Length == 0) pnlVal1.Visible = false;

        _val2 = dt.Rows[0]["Val2"].ToString();
        if (_val2.ToString().Length == 0) pnlVal2.Visible = false;

        _val3 = dt.Rows[0]["Val3"].ToString();
        if (_val3.ToString().Length == 0) pnlVal3.Visible = false;

        _val4 = dt.Rows[0]["Val4"].ToString();
        if (_val4.ToString().Length == 0) pnlVal4.Visible = false;

        _val5 = dt.Rows[0]["Val5"].ToString();
        if (_val5.ToString().Length == 0) pnlVal5.Visible = false;

        _val6 = dt.Rows[0]["Val6"].ToString();
        if (_val6.ToString().Length == 0) pnlVal6.Visible = false;

        _val7 = dt.Rows[0]["Val7"].ToString();
        if (_val6.ToString().Length == 0) pnlVal7.Visible = false;

        int x = sf.counttable("languages", "");
        if (x == 0) pnlDiller.Visible = false;
    }




    public void kategoriler(int type)
    {
        DataTable dt = sf.getdt("categories", "Where TypeId=" + type);
        drpKategoriler.DataTextField = "CatName";
        drpKategoriler.DataValueField = "CatId";
        drpKategoriler.DataSource = dt;
        drpKategoriler.DataBind();

        drpKategoriler.Items.Insert(0, new ListItem("Kategori Seçiniz", "0"));
    }


    public void diller()
    {
        DataTable dt = sf.getdt("languages", "");
        drpDiller.DataTextField = "LangName";
        drpDiller.DataValueField = "LangValue";
        drpDiller.DataSource = dt;
        drpDiller.DataBind();

        drpDiller.Items.Insert(0, new ListItem("Türkçe", "tr"));
    }



    public void Goster(int x)
    {
        DataTable dt = sf.getdt("pages", "Where PageId=" + x);
        txtBaslik.Text = dt.Rows[0]["PageTitle"].ToString();
        txtOzet.Text = dt.Rows[0]["PageSummary"].ToString();
        txtIcerik.Text = dt.Rows[0]["PageText"].ToString();
        chck1.Checked = (dt.Rows[0]["Chck1"].ToString() == "True") ? true : false;
        chck2.Checked = (dt.Rows[0]["Chck2"].ToString() == "True") ? true : false;
        txtVal1.Text = dt.Rows[0]["Val1"].ToString();
        txtVal2.Text = dt.Rows[0]["Val2"].ToString();
        txtVal3.Text = dt.Rows[0]["Val3"].ToString();
        txtVal4.Text = dt.Rows[0]["Val4"].ToString();
        txtVal5.Text = dt.Rows[0]["Val5"].ToString();
        txtVal6.Text = dt.Rows[0]["Val6"].ToString();
        txtVal7.Text = dt.Rows[0]["Val7"].ToString();
        drpKategoriler.SelectedValue = dt.Rows[0]["CatId"].ToString();
        txtTags.Text = sf.etiketler(x);
        txtTags.Attributes["data-id"] = x.ToString();



        drpDiller.SelectedValue = dt.Rows[0]["Lang"].ToString();
    }

    protected void btnGonder_Click(object sender, EventArgs e)
    {

        int id = Convert.ToInt32(Request["id"]);
        int typeid = Convert.ToInt32(Request["type"]);
        int subid = Convert.ToInt32(Request["subid"]);
        int sourceid = (sf.counttable("pages", "Where PageId=" + (Convert.ToInt32(Request["sourceid"]))) == 0) ? 0 : (Convert.ToInt32(Request["sourceid"]));


        string lang = (drpDiller.SelectedValue == "") ? "tr" : drpDiller.SelectedValue;

        DateTime tarih = DateTime.Now;
        string isim = sf.isImageFile(fl1);
        Boolean hata = false;

        string title = txtBaslik.Text;
        string summary = txtOzet.Text;
        string text = txtIcerik.Text;
        string baslik = txtBaslik.Text;
        int chc1 = (chck1.Checked) ? 1 : 0;
        int chc2 = (chck2.Checked) ? 1 : 0;
        string val1 = txtVal1.Text;
        string val2 = txtVal2.Text;
        string val3 = txtVal3.Text;
        string val4 = txtVal4.Text;
        string val5 = txtVal5.Text;
        string val6 = txtVal6.Text;
        string val7 = txtVal7.Text;

        string catid = Convert.ToInt32(drpKategoriler.SelectedValue).ToString();

        if (title == "")
        {
            pnlAlert.Visible = true;
            lblHata.Text = "Sayfa adı boş olamaz";
            hata = true;
        }


        if (isim == "gecersiz") { hata = true; pnlAlert.Visible = true; lblHata.Text = fl1.PostedFile.FileName + " adlı dosyanın formatı uygun değil. Lütfen jpg ya da png yükleyiniz. </br>"; }

        if (!hata)
        {
            List<String> columns = new List<string>() { "SubPageId", "CatId", "TypeId", "Lang", "PageTitle", "PageSummary", "PageText", "Chck1", "Chck2", "Val1", "Val2", "Val3", "Val4", "Val5","Val6","Val7" };
            List<String> values = new List<string>() { subid.ToString(), catid, typeid.ToString(), lang, title, summary, text, chc1.ToString(), chc2.ToString(), val1, val2, val3, val4, val5,val6,val7 };

            if (fl1.HasFile)
            {
                List<string> paths = new List<string>() { "thumb", "kucuk", "orta", "buyuk" };
                List<int> pvalues = new List<int>() { 150, 320, 640, 960 };

                sf.fotografkaydet(isim, fl1, paths, pvalues, true);

                if (id > 0) sf.deletefile("pages", "Where PageId=" + id);
                columns.Add("PictureUrl");
                values.Add(isim);
            }
            else if (sourceid > 0)
            {
                columns.Add("PictureUrl");
                values.Add(sf.SatirBilgileriGetir("PictureUrl", "pages", "Where PageId=" + sourceid));
            }

            string retid = sf.inored("pages", "PageId", id, columns, values, true, true);
            if (retid != "0") //yeni eklenen
            {
                id = Convert.ToInt32(retid);
            }

            sf.etiketleriekle(id, txtTags.Text);



            if (retid != "0" && sourceid != 0)  // kopyalama durumu varsa
            {
                sf.altdosyalarikopyala(Convert.ToInt32(retid), sourceid);
            }

            Response.Redirect("icerikler?added=true&type=" + typeid);
        }

    }




}

#line default
#line hidden
