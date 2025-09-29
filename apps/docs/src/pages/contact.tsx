import React from "react";
import Layout from "@theme/Layout";

export default function Contact(): React.ReactElement {
  return (
    <Layout title="Contact" description="Contact Phoenix Rooivalk">
      <main className="contactMain">
        <section className="contactSection">
          <h1>Contact Us</h1>
          <p>
            Please share your details and a short message. Our team will respond
            within one business day.
          </p>
          <form
            name="contact"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            action="/contact"
            className="contactForm"
          >
            <input type="hidden" name="form-name" value="contact" />
            <p hidden>
              <label>
                Don’t fill this out: <input name="bot-field" />
              </label>
            </p>

            <div className="contactGrid">
              <label>
                Name
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Doe"
                  className="contactInput"
                />
              </label>
              <label>
                Organization
                <input
                  type="text"
                  name="organization"
                  placeholder="Acme Defense"
                  className="contactInput"
                />
              </label>
              <label>
                Email
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@example.com"
                  className="contactInput"
                />
              </label>
              <label>
                Message
                <textarea
                  name="message"
                  rows={6}
                  required
                  placeholder="Tell us about your requirements"
                  className="contactTextarea"
                />
              </label>
              <button
                type="submit"
                className="button button--primary button--lg"
              >
                Send
              </button>
            </div>
          </form>

          <p>
            Prefer email?{" "}
            <a href="mailto:info@phoenixrooivalk.com">
              info@phoenixrooivalk.com
            </a>
          </p>
        </section>
      </main>
    </Layout>
  );
}
