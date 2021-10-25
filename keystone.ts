import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';

import User from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import sendPasswordResetEmail from './lib/mail';

const databaseURL = process.env.DATABASE_URL;
const sessionConfig = {
    maxAge: 60 * 60 * 24 * 360, // how long should they stay signed in?
    secret: process.env.COOKIE_SECRET,
};

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['email', 'password'],
    },
    passwordResetLink: {
        async sendToken(args) {
            // send the email
            console.log(args);
            await sendPasswordResetEmail(args.token, args.identity);
        },
    },
});

export default withAuth(
    config({
        server: {
            cors: {
                origin: [process.env.FRONTEND_URL],
                credentials: true,
            },
        },
        db: {
            adapter: 'mongoose',
            url: databaseURL,
            onConnect() {
                console.log('Connected to the database!');
            },
        },
        lists: createSchema({
            User,
            Product,
            ProductImage,
        }),
        ui: {
            isAccessAllowed: ({ session }) => session?.data,
        },
        session: withItemData(statelessSessions(sessionConfig), {
            User: `id`,
        }),
    }),
);
