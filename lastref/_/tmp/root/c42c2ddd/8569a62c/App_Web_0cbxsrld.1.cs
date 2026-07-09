#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\signup.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "C047FCE661893248F4F7F06FF5F7FAC3A1AF697F"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\signup.aspx.cs"
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

public partial class Default2 : System.Web.UI.Page
{

    sayfa sf = new sayfa();
    protected void Page_Load(object sender, EventArgs e)
    {
        if (sf.islogin() > 0) Response.Redirect("default.aspx");
        sf.seo("Create Account");
    }



    protected void btnGonder_Click(object sender, EventArgs e)
    {
        string uyead = sf.fix(txtName.Text);
        string mail = sf.fix(txtMail.Text);
        string sifre = sf.fix(txtSifre.Text);
        string country = sf.fix(txtCountry.Text);


        int count = sf.counttable("uye", "Where UyeId='" + mail + "'");


        if (uyead == "" || mail == "" || sifre == "")
        {
            lblSuccess.Visible = false;
            lblError.Text = "Please fill in the required fields.";
            lblError.Visible = true;
            lblError.ForeColor = System.Drawing.Color.Red;
        }

        else if (!sf.TestEmailRegex(mail))
        {
            lblSuccess.Visible = false;
            lblError.Text = "Please, enter a valid email.";
            txtMail.Attributes["class"] = "error";
            lblError.Visible = true;
            lblError.ForeColor = System.Drawing.Color.Red;
        }

        else if (txtSifre.Text != txtSifret.Text)
        {
            lblSuccess.Visible = false;
            lblError.Text = "The passwords you entered does not match.";
            txtMail.Attributes["class"] = "error";
            lblError.Visible = true;
            lblError.ForeColor = System.Drawing.Color.Red;
        }


        else if (count > 0)
        {
            txtMail.Attributes["class"] = "error";
            lblError.Visible = true;
            lblError.Text = "Your email address is in use. Please register with a different email. </br>";
        }
        else
        {

            txtMail.Attributes["class"] = "";
            lblError.Visible = false;
            lblSuccess.Visible = true;
            btnGonder.Enabled = false;

            List<String> columns = new List<string>() { "UyeAd", "UyeUlke", "MailAdres", "Sifre", "Status" };
            List<String> values = new List<string>() { uyead, country, mail, sifre, "1" };
            sf.inored("uye", "UyeId", 0, columns, values, false);

        }
    }
}

#line default
#line hidden
