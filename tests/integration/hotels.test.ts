import faker from '@faker-js/faker';
import { Hotel } from '@prisma/client';
import httpStatus from 'http-status';
import * as jwt from 'jsonwebtoken';
import supertest from 'supertest';
import { cleanDb, generateValidToken } from '../helpers';
import { prisma } from '@/config';
import app, { init } from '@/app';
import { createFakeHotel, createFakeRoom, createEnrollmentWithAddress, createUser, createTicketType, createTicket } from '../factories';

beforeAll(async () => {
    await init();
});

beforeEach(async () => {
    await cleanDb();
});

const server = supertest(app);

describe('get /hotels  authenticator errors', () => {
    it("Should respond status 401 when token is not given", async () => {
        const response = await server.get('/hotels');

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    it("Should respond status 401 when token is invalid", async () => {
        const invalidToken = faker.random.alphaNumeric();

        const response = await server.get('/hotels').set('Authorization', `Bearer ${invalidToken}`);

        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });




})