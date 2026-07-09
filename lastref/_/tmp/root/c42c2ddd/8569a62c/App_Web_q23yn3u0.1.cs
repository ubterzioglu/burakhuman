#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\profil.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "BEF1CBCD25AB900EF60F7C401D5327EECA5C9682"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\admin\profil.aspx.cs"
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
    }
    protected void btnGonder_Click(object sender, EventArgs e)
    {
        string sifre = sf.fix(txtSifre.Text);
        string eskisifre = sf.fix(txtExSifre.Text);
        DateTime tarih = DateTime.Now;
        int id = 1;

        int countx = sf.counttable("admin", "Where AdminId=1 and AdminPassword='" + eskisifre + "'");
        
        if (sifre == "")
        {
            pnlAlert.Visible = true;
            lblHata.Text = "Sifre boş olamaz";
        }

        else if(countx==0){
            
            pnlAlert.Visible = true;
            lblHata.Text = "Geçersiz şifre girdiniz.";
        }
        else if(sifre==eskisifre){
            pnlAlert.Visible = true;
            lblHata.Text = "Yeni şifreniz, eski şifrenizden farklı olmak zorunda.";
        }

        else
        {
            pnlAlert.Visible = false;
            List<String> columns = new List<string>() { "AdminPassword"};
            List<String> values = new List<string>() { sifre};
            sf.inored("admin", "AdminId", id, columns, values, false);
            pnlSuccess.Visible = true;   
        }

    }
}

#line default
#line hidden
