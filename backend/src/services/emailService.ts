import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST || 'localhost';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '1025');
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const EMAIL_FROM = process.env.EMAIL_FROM || 'noreply@meincms.local';
const APP_URL = process.env.APP_URL || 'http://localhost:5173';

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: false, // true for 465, false for other ports
  auth: SMTP_USER ? {
    user: SMTP_USER,
    pass: SMTP_PASS,
  } : undefined,
  tls: {
    rejectUnauthorized: false // For development
  }
});

export const sendVerificationEmail = async (email: string, token: string, username: string) => {
  const verificationUrl = `${APP_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'MeinCMS - Email verifizieren',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Willkommen bei MeinCMS, ${username}!</h2>
        <p>Vielen Dank für deine Registrierung. Bitte verifiziere deine Email-Adresse, um deinen Account zu aktivieren.</p>
        <p>
          <a href="${verificationUrl}"
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
            Email verifizieren
          </a>
        </p>
        <p>Oder kopiere diesen Link in deinen Browser:</p>
        <p style="color: #666; word-break: break-all;">${verificationUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Dieser Link ist 24 Stunden gültig. Wenn du dich nicht registriert hast, kannst du diese Email ignorieren.
        </p>
      </div>
    `,
    text: `
Willkommen bei MeinCMS, ${username}!

Bitte verifiziere deine Email-Adresse:
${verificationUrl}

Dieser Link ist 24 Stunden gültig.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
};

export const sendPasswordResetEmail = async (email: string, token: string, username: string) => {
  const resetUrl = `${APP_URL}/reset-password?token=${token}`;

  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'MeinCMS - Passwort zurücksetzen',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Passwort zurücksetzen</h2>
        <p>Hallo ${username},</p>
        <p>Du hast angefordert, dein Passwort zurückzusetzen. Klicke auf den Button unten, um ein neues Passwort zu erstellen.</p>
        <p>
          <a href="${resetUrl}"
             style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px;">
            Passwort zurücksetzen
          </a>
        </p>
        <p>Oder kopiere diesen Link in deinen Browser:</p>
        <p style="color: #666; word-break: break-all;">${resetUrl}</p>
        <p style="color: #999; font-size: 12px; margin-top: 30px;">
          Dieser Link ist 1 Stunde gültig. Wenn du diese Anfrage nicht gestellt hast, kannst du diese Email ignorieren.
        </p>
      </div>
    `,
    text: `
Passwort zurücksetzen

Hallo ${username},

Du hast angefordert, dein Passwort zurückzusetzen:
${resetUrl}

Dieser Link ist 1 Stunde gültig.
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
};

export const sendWelcomeEmail = async (email: string, username: string) => {
  const mailOptions = {
    from: EMAIL_FROM,
    to: email,
    subject: 'Willkommen bei MeinCMS!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Willkommen bei MeinCMS, ${username}!</h2>
        <p>Deine Email-Adresse wurde erfolgreich verifiziert.</p>
        <p>Du kannst jetzt alle Features von MeinCMS nutzen.</p>
        <p>
          <a href="${APP_URL}/login"
             style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px;">
            Jetzt einloggen
          </a>
        </p>
      </div>
    `,
    text: `
Willkommen bei MeinCMS, ${username}!

Deine Email-Adresse wurde erfolgreich verifiziert.
Login: ${APP_URL}/login
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error here, as this is not critical
  }
};
