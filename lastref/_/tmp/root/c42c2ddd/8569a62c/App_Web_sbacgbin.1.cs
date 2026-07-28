#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\contact.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "36B59BD171FB06BDDE5C24A5DE95836E5F5DCBC5"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\contact.aspx.cs"
using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;

public partial class Default2 : System.Web.UI.Page
{

    sayfa sf = new sayfa();
    public string _tel = "", _adres = "", _mail = "", _fax = "";
    protected void Page_Load(object sender, EventArgs e)
    {
        if (!IsPostBack)
        {
            bilgiler();
        }
        sf.seo("Contact");
    }

    public void bilgiler()
    {
        ltlIletisim.Text = sf.SatirBilgileriGetir("PageText", "pages", "Where PageId=6");

    }


    protected void Button1_Click(object sender, EventArgs e)
    {

        string siteurl = Request.Url.GetLeftPart(UriPartial.Authority);
        DateTime tarih = DateTime.Now;
        string mail = sf.fix(txtMail.Text);

        string mesaj = @"<br><strong>Ad Soyad : </strong><br> " + sf.fix(txtAd.Text) +
                        @"<br><strong>Mail : </strong><br> " + sf.fix(txtMail.Text) +
                        @"<br><strong>İrtibat Numarası : </strong><br> " + sf.fix(txtTel.Text) +
        @"<br><br><strong>Mesajı : </strong><br> " + sf.fix(txtMesaj.Text);
    
        string konu = "İLETİŞİM / TALEP FORMU";


        sf.SendMail(konu, mesaj, "info@yazarge.com");

        List<string> columns = new List<string> { "Name", "Telephone", "MailAdress", "Subject", "Message" };
        List<string> values = new List<string> { sf.fix(txtAd.Text), sf.fix(txtTel.Text), sf.fix(txtMail.Text), konu, mesaj };
        sf.inored("messages", "MessageId", 0, columns, values, true, false);

        pnlIletisim.Visible = false;
        pnlSonuc.Visible = true;
        btnGonder.Enabled = false;
    }
}

#line default
#line hidden
