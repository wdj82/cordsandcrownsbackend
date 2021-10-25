import { createTransport, getTestMessageUrl } from 'nodemailer';

const transport = createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

function makeEmail(text: string): string {
    return `
        <div style="
            border: 1px solid black;
            padding: 20px;
            font-family: sans-serif;
            line-height: 2;
            font-size: 20px;
        ">
            <h2>Hello There!</h2>
            <p>${text}</p>
            <p>Cords and Crowns</p>
        </div>
    `;
}

export interface MailResponse {
    accepted?: string[] | null;
    rejected?: null[] | null;
    envelopeTime: number;
    messageTime: number;
    messageSize: number;
    response: string;
    envelope: Envelope;
    messageId: string;
}
export interface Envelope {
    from: string;
    to?: string[] | null;
}

async function sendPasswordResetEmail(resetToken: string, to: string): Promise<void> {
    // email the user a token
    const info = (await transport.sendMail({
        to,
        from: 'test@example.com',
        subject: 'Your password reset link!',
        html: makeEmail(`Your Password Reset Link is here!
        
            <a href="${process.env.FRONTEND_URL}/reset?token=${resetToken}">Click Here to Reset Your Password</a>
        `),
    })) as MailResponse;

    if (process.env.MAIL_USER.includes('ethereal.email')) {
        console.log(`Message Sent! Preview it at ${getTestMessageUrl(info)}`);
    }
}

export default sendPasswordResetEmail;
