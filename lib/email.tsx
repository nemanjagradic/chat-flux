import { Resend } from "resend";
import { render } from "@react-email/render";
import WelcomeEmail from "../emails/welcomeEmail";
import PasswordResetEmail from "../emails/passwordResetEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export class Email {
  to: string;
  firstName: string;
  url: string;
  from: string;

  constructor(user: { email: string; name: string }, url: string) {
    this.to = user.email;
    this.firstName = user.name.split(" ")[0];
    this.url = url;
    this.from = process.env.EMAIL_FROM!;
  }

  async send(template: React.ReactElement, subject: string) {
    const html = await render(template);

    await resend.emails.send({
      from: this.from,
      to: this.to,
      subject,
      html,
    });
  }

  async sendWelcome() {
    await this.send(
      <WelcomeEmail firstName={this.firstName} url={this.url} />,
      "Welcome!",
    );
  }

  async sendPasswordReset() {
    await this.send(
      <PasswordResetEmail firstName={this.firstName} url={this.url} />,
      "Password reset token (valid for 10 minutes)",
    );
  }
}
