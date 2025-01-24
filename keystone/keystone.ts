import { config } from '@keystone-6/core';
import { lists } from './schemas/index';
import { createAuth } from '@keystone-6/auth';
import { statelessSessions } from '@keystone-6/core/session';
import path from 'path';
import dotenv from 'dotenv';

// dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('Starting Keystone init...');
const envPath = path.resolve(__dirname, '../.env');
console.log('Using env file at:', envPath);
dotenv.config({ path: envPath });

console.log('SESSION_SECRET is:', process.env.SESSION_SECRET);

const sessionConfig = {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    secret: process.env.SESSION_SECRET || 'some-long-secret-value',
};

console.log('Creating auth config...');

const { withAuth } = createAuth({
    listKey: 'User',
    identityField: 'email',
    secretField: 'password',
    initFirstItem: {
        fields: ['name', 'email', 'password'],
    },
});

console.log('Setting up Keystone config...');

export default withAuth(
    config({
        db: {
            provider: 'sqlite',
            url: 'file:./keystone.db',
        },
        lists,
        storage: {
            localImages: {
                kind: 'local',
                type: 'image',
                generateUrl: path => `/images${path}`,
                serverRoute: {
                    path: '/images',
                },
                storagePath: 'public/images',
            },
        },
        session: statelessSessions(sessionConfig),
        ui: {
            // Restrict the Admin UI to signed-in admin users:
            isAccessAllowed: (context) => !!context.session?.data,
        },
        server: {
            port: 3001,
            cors: {
                origin: ['http://localhost:3000'], 
                credentials: true
            },
        },
    })
);