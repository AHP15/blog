import {jest} from '@jest/globals';
import request from 'supertest';

import DB from '../../models/index.js';
import app from '../../app.js';
import connection from '../db.setup.js';
import {
  USERNAME_REQUIRED,
  LONG_USERNAME,
  SHORT_USERNAME,
  EMAIL_REQUIRED,
  PASSWORD_REQUIRED,
  SHORT_PASSWORD
} from '../../constants.js'

jest.setTimeout(60000);

const signupRequests = {
  signup: () => request(app).post('/user/auth/signup').send({
    username: 'test',
    email: 'test@gmail.com',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signupUsernameRequired: () =>  request(app).post('/user/auth/signup').send({
    email: 'test@gmail.com',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signupUsernameMinLength: () =>  request(app).post('/user/auth/signup').send({
    username: 'te',
    email: 'test@gmail.com',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signupUsernameMaxLength: () =>  request(app).post('/user/auth/signup').send({
    username: 'test'.repeat(8),
    email: 'test@gmail.com',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signupEmailRequired: () =>  request(app).post('/user/auth/signup').send({
    username: 'test',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signupDuplicateEmail: () =>  request(app).post('/user/auth/signup').send({
    username: 'duplicate',
    email: 'duplicate@gmail.com',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signupInvalidEmail: () =>  request(app).post('/user/auth/signup').send({
    username: 'test',
    email: 'test test',
    password: 'dkhfslmkqjjsazzdz'
  }),
  signupPasswordRequired: () =>  request(app).post('/user/auth/signup').send({
    username: 'test',
    email: "test2@gmail.com",
  }),
  signupPasswordMinLength: () =>  request(app).post('/user/auth/signup').send({
    username: 'test',
    email: 'test@gmail.com',
    password: 'hfjd'
  }),
};

describe('Test the signup route', () => {
  let signupResponses;
  let userId;
  beforeAll(async () => {
    signupResponses = await Promise.allSettled(
      Object.values(signupRequests).map(req => req())
    );
  });

  afterAll(async () => {
    await DB.user.findByIdAndDelete(userId);
  });

  it('Create a new user', () => {
    const res = signupResponses[0];
    const {statusCode, body} = res.value;
    userId = body.user._id;

    // Assertions
    expect(statusCode).toBe(201);
    expect(body.success).toBe(true);
    expect(body.user.username).toBe('test');
  });


  // username validation
  it('User without username should fail', () => {
    const res = signupResponses[1];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe(USERNAME_REQUIRED);
  });

  it('User`s username with less then 4 chars should fail', () => {
    const res = signupResponses[2];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe(SHORT_USERNAME);
  });

  it('User`s username with more then 30 chars should fail', () => {
    const res = signupResponses[3];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe(LONG_USERNAME);
  });


  // email validation
  it('User without email should fail', () => {
    const res = signupResponses[4];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe(EMAIL_REQUIRED);
  });

  it('Should fail already emails aleardy exist in database', () => {
    const res = signupResponses[5];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('user with duplicate@gmail.com already exists');
  });

  it('Should fail Invalid email', () => {
    const res = signupResponses[6];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe('test test is not a valid email address!');
  });


  // password validation
  it('User without password should fail', () => {
    const res = signupResponses[7];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe(PASSWORD_REQUIRED);
  });

  it('User with password less the 8 chars should fail', () => {
    const res = signupResponses[8];
    const {statusCode, body} = res.value;

    // Assertions
    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(body.message).toBe(SHORT_PASSWORD);
  });

});
