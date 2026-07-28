#pragma checksum "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\login.aspx.cs" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "B2035AADF4ABF3D805CF4D20B2B7BF81666C09DA"

#line 1 "C:\Inetpub\vhosts\humanconsciousnessdecoded.com\httpdocs\login.aspx.cs"
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
        if (sf.islogin() > 0) Response.Redirect("defaul.aspx");

        
    }


    protected void btnGonder_Click(object sender, EventArgs e)
    {
        string mail = sf.fix(txtMail.Text);
        string sifre = sf.fix(txtSifre.Text);



        int count = sf.counttable("uye", "Where MailAdres='" + mail + "' and Status='0'");


        if (mail == "" || sifre == "")
        {
            lblError.Text = "Please fill in the required fields.";
            lblError.Visible = true;
            lblError.ForeColor = System.Drawing.Color.Red;
        }

        else if (!sf.TestEmailRegex(mail))
        {
            lblError.Text = "Please, enter a valid email.";
            txtMail.Attributes["class"] = "error";
            lblError.Visible = true;
            lblError.ForeColor = System.Drawing.Color.Red;
        }


        else if (count > 0)
        {
            txtMail.Attributes["class"] = "error";
            lblError.Visible = true;
            lblError.Text = "Üyeliğiniz onaylanmamış. Lütfen daha sonra tekrar deneyiniz. </br>";
        }

        else
        {

            txtMail.Attributes["class"] = "";
            lblError.Visible = false;

            string sonuc = sf.userlogin(mail, sifre);
            if (sonuc == "1")
            {
                btnGonder.Enabled = false;
                Response.Redirect("default.aspx");
            }

            else
            {
                lblError.Visible = true;
                lblError.Text = "Your e-mail address or password is incorrect. Please try again.";
            }
        }
    }
}

#line default
#line hidden
