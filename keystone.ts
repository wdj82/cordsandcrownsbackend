import 'dotenv/config';
import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import { withItemData, statelessSessions } from '@keystone-next/keystone/session';

import User from './schemas/User.ts';

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
        fields: ['name', 'email', 'password'],
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
        },
        lists: createSchema({
            User,
        }),
        ui: {
            isAccessAllowed: ({ session }) => session?.data,
        },
        session: withItemData(statelessSessions(sessionConfig), {
            User: `id`,
        }),
    }),
);