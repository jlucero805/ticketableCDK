import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as TickettableCdk from '../lib/tickettable_cdk-stack';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

const url = process.env.BASE_ENDPOINT;

test('GET /members', async () => {
  const res = await axios.get(url + '/members', {
    headers: {
      authorization: '123',
    },
  });
  expect(res.status).toBe(200);
});

test('POST /members', async () => {
  let status;
  try {
    const res = await axios.post(url + '/members', {
      username: 'jluce',
      email: 'jluce@test.com',
      name: 'Jason',
    },
    { 
      headers: {
        authorization: '123',
      },
    }
    );
    status = res.status;
  } catch (e) {
    status = (e as any).response.status;
  };
  expect(status).toBe(409);
});

test('GET /members/{memberId}', async () => {
  const res = await axios.get(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524', {
    headers: {
      authorization: '123',
    },
  });
  expect(res.status).toBe(200);
});

test('PUT /members/{memberId}', async () => {
  const res = await axios.put(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524',
  {
    description: 'nice',
    name: 'name',
  },
  {
    headers: {
      authorization: '123',
    },
  });
  expect(res.status).toBe(200);
});

test('GET /members/{memberId}/projects', async () => {
  const res = await axios.get(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524/projects', {
    headers: {
      authorization: '123',
    },
  });
  expect(res.status).toBe(200);
});

test('POST /members/{memberId}/projects', async () => {
  let status;
  try {
    const res = await axios.post(url + '/members/f697d05a-8e17-4d6c-ad66-57efd53aa524/projects', {
      name: 'ticketable',
    },
    { 
      headers: {
        authorization: '123',
      },
    }
    );
    status = res.status;
  } catch (e) {
    status = (e as any).response.status;
  };
  expect(status).toBe(409);
});