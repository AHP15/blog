import {jest} from '@jest/globals';
import request from 'supertest';

import app from '../../app.js';
import connection from '../db.setup.js';

jest.setTimeout(60000);

const requests = {
  signin: () => request(app).post('/user/auth/signin').send({
    email: 'duplicate@gmail.com', // this email exists in DB
    password: 'dkhfslmkqjjsazzdz'
  }),
  signinInvalidEmail: () => request(app).post('/user/auth/signin').send({
    email: 'test test',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signinEmailRequired:() =>  request(app).post('/user/auth/signin').send({
    password: 'dkhfslmkqjjsazzdz'
  }),
  signinPasswordRequired: () => request(app).post('/user/auth/signin').send({
    email: 'duplicate@gmail.com', // this email exists in DB
  }),
  signinEmailNotFound: () => request(app).post('/user/auth/signin').send({
    email: 'test@gmail.com', // does not exists in DB
    password: 'dkhfslmkqjjsazzdz'
  }),
  signinIncorrectPassword: () => request(app).post('/user/auth/signin').send({
    email: 'duplicate@gmail.com', // this email exists in DB
    password: 'dkhfslmkqjazzdz'
  }),
};


describe('Test the signin route', () => {
  let responses;
  beforeAll(async () => {
    responses = await Promise.allSettled(Object.values(requests).map(req => req()));
  });
  it('singin a user', () => {
    const res = responses[0];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.user.username).toBe('duplicate');
  });

  it('Invalid email should fail', () => {
    const res = responses[1];
    const {statusCode, body} = res.value;
    console.log(body, statusCode);

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('test test is not a valid email address!');
  });

  it('singin without email should fail', () => {
    const res = responses[2];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Email not provided');
  });

  it('singin without password should fail', () => {
    const res = responses[3];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Password not provided');
  });

  it('response with email not found', () => {
    const res = responses[4];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(404);
    expect(body.success).toBe(false);
    expect(body.message).toBe('user with test@gmail.com not found');
  });

  it('response with incorrect password', () => {
    const res = responses[5];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('Incorrect password');
  });
});
