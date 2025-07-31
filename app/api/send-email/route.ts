import nodemailer from 'nodemailer';
import { NextRequest, NextResponse } from 'next/server';

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const body: ContactFormData = await request.json();
    const { name, email, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { 
          error: 'Missing required fields', 
          details: 'Name, email, and message are required' 
        }, 
        { status: 400 }
      );
    }

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    // Verify SMTP connection
    try {
      await transporter.verify();
      console.log('SMTP connection verified successfully');
    } catch (verifyError) {
      console.error('SMTP verification failed:', verifyError);
      return NextResponse.json(
        { 
          error: 'Email service configuration error',
          details: 'Unable to connect to email service'
        }, 
        { status: 500 }
      );
    }

    // Configure mail options
const mailOptions = {
  from: process.env.EMAIL_USER,
  to: process.env.EMAIL_RECEIVER,
  replyTo: email,
  subject: `📨 New Message from ${name}`,
  text: `
Name: ${name}
Email: ${email}
Message: ${message}
  `,
  html: `
  <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f1f5f9; padding: 40px 20px; margin: 0; color: #0f172a;">
    <table style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0, 0, 0, 0.07);">
      <tr>
        <td style="padding: 30px 40px 20px 40px;">
          <h2 style="margin: 0 0 10px 0; font-size: 26px; font-weight: 700; color: #111827;">📩 You've Got a New Message</h2>
          <p style="margin: 0; color: #6b7280; font-size: 15px;">This message was submitted through your portfolio contact form.</p>
        </td>
      </tr>

      <tr>
        <td style="padding: 0 40px 30px 40px;">
          <table width="100%" style="margin-top: 20px;">
            <tr>
              <td style="padding: 10px 0; font-size: 16px;">
                <strong style="color: #1e293b;">👤 Name:</strong><br/>
                <span style="color: #334155;">${name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 16px;">
                <strong style="color: #1e293b;">📧 Email:</strong><br/>
                <a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-size: 16px;">
                <strong style="color: #1e293b;">💬 Message:</strong><br/>
                <div style="margin-top: 10px; padding: 15px 20px; background-color: #f8fafc; border-left: 4px solid #3b82f6; border-radius: 6px; color: #475569; font-size: 15px; line-height: 1.6;">
                  ${message.replace(/\n/g, '<br>')}
                </div>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <tr>
        <td style="background-color: #f9fafb; text-align: center; padding: 25px 40px; font-size: 13px; color: #94a3b8;">
          Sent via your portfolio | <span style="color: #64748b;">All rights reserved © ${new Date().getFullYear()}</span>
        </td>
      </tr>
    </table>
  </div>
  `
};


    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Email sent successfully',
        messageId: info.messageId
      }, 
      { status: 200 }
    );

  } catch (error: any) {
    console.error('Email sending error:', error);
    
    // Return more specific error information
    let errorMessage = 'Failed to send email';
    let errorDetails = error.message;

    if (error.code === 'EAUTH') {
      errorMessage = 'Email authentication failed';
      errorDetails = 'Please check your email credentials and app password';
    } else if (error.code === 'ECONNECTION') {
      errorMessage = 'Connection to email service failed';
      errorDetails = 'Please check your internet connection and email service settings';
    }

    return NextResponse.json(
      { 
        error: errorMessage,
        details: errorDetails,
        code: error.code || 'UNKNOWN'
      }, 
      { status: 500 }
    );
  }
}

// Optional: Handle other HTTP methods
export async function GET() {
  return NextResponse.json(
    { 
      message: 'Contact form endpoint is working. Use POST to send messages.' 
    }, 
    { status: 200 }
  );
}