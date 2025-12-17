import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { query } from '../db.js';
import { sendVerificationEmail, sendPasswordResetEmail, sendWelcomeEmail } from '../services/emailService.js';

// Request email verification
export const requestEmailVerification = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const result = await query(
      'SELECT id, username, email, is_verified FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If the email exists, a verification link has been sent' });
    }

    const user = result.rows[0];

    if (user.is_verified) {
      return res.status(400).json({ error: 'Email already verified' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Save token to database
    await query(
      `UPDATE users
       SET verification_token = $1, verification_token_expires = $2
       WHERE id = $3`,
      [verificationToken, expiresAt, user.id]
    );

    // Send verification email
    await sendVerificationEmail(user.email, verificationToken, user.username);

    res.json({ message: 'Verification email sent successfully' });
  } catch (error) {
    console.error('Request verification error:', error);
    res.status(500).json({ error: 'Failed to send verification email' });
  }
};

// Verify email with token
export const verifyEmail = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Token is required' });
    }

    // Find user with this verification token
    const result = await query(
      `SELECT id, username, email, verification_token_expires
       FROM users
       WHERE verification_token = $1`,
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired verification token' });
    }

    const user = result.rows[0];

    // Check if token expired
    if (new Date() > new Date(user.verification_token_expires)) {
      return res.status(400).json({ error: 'Verification token has expired' });
    }

    // Verify the user
    await query(
      `UPDATE users
       SET is_verified = true, verification_token = NULL, verification_token_expires = NULL
       WHERE id = $1`,
      [user.id]
    );

    // Send welcome email
    await sendWelcomeEmail(user.email, user.username);

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ error: 'Failed to verify email' });
  }
};

// Request password reset
export const requestPasswordReset = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Find user
    const result = await query(
      'SELECT id, username, email FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      // Don't reveal if user exists for security
      return res.json({ message: 'If the email exists, a password reset link has been sent' });
    }

    const user = result.rows[0];

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Save token to database
    await query(
      `INSERT INTO password_reset_tokens (user_id, token, expires_at)
       VALUES ($1, $2, $3)`,
      [user.id, resetToken, expiresAt]
    );

    // Send reset email
    await sendPasswordResetEmail(user.email, resetToken, user.username);

    res.json({ message: 'Password reset email sent successfully' });
  } catch (error) {
    console.error('Request password reset error:', error);
    res.status(500).json({ error: 'Failed to send password reset email' });
  }
};

// Reset password with token
export const resetPassword = async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ error: 'Token and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Find valid reset token
    const tokenResult = await query(
      `SELECT prt.id, prt.user_id, prt.expires_at, prt.used
       FROM password_reset_tokens prt
       WHERE prt.token = $1`,
      [token]
    );

    if (tokenResult.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const resetTokenData = tokenResult.rows[0];

    // Check if token expired
    if (new Date() > new Date(resetTokenData.expires_at)) {
      return res.status(400).json({ error: 'Reset token has expired' });
    }

    // Check if token already used
    if (resetTokenData.used) {
      return res.status(400).json({ error: 'Reset token has already been used' });
    }

    // Hash new password
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(newPassword, saltRounds);

    // Update password and mark token as used
    await query('BEGIN');

    await query(
      'UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
      [passwordHash, resetTokenData.user_id]
    );

    await query(
      'UPDATE password_reset_tokens SET used = true WHERE id = $1',
      [resetTokenData.id]
    );

    await query('COMMIT');

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    await query('ROLLBACK');
    console.error('Password reset error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
};
