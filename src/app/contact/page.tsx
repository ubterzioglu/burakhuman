import { PublicShell } from "@/components/PublicShell";
import { getContactPage } from "@/lib/data";
import { cleanHtml } from "@/lib/sanitize";
import { ContactForm } from "./ContactForm";

export const metadata = {
  title: "Contact",
};

export default async function ContactPage() {
  const contact = await getContactPage();

  return (
    <PublicShell>
      <div className="breadcrumb-box" />
      <section className="content-section">
        <div className="container contact-grid">
          <div className="content-html" dangerouslySetInnerHTML={{ __html: cleanHtml(contact?.body) }} />
          <ContactForm />
        </div>
      </section>
    </PublicShell>
  );
}
