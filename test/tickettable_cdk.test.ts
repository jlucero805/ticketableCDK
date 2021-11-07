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
  expect(res.data.rows[0].description)
    .toBe('nice');
  expect(res.data.rows[0].name)
    .toBe('name');
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

test('GET /orgs', async () => {
  const res = await axios.get(url + '/orgs', {
    headers: {
      authorization: '123',
    },
  });
  expect(res.status).toBe(200);
});

test('POST /orgs', async () => {
  let status;
  try {
    const res = await axios.post(url + '/orgs', {
      username: 'Amazon',
      email: 'amazon@test.com',
      name: 'Amazon',
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

test('GET /orgs/{orgId}', async () => {
  const res = await axios.get(url + '/orgs/4ada500d-eb71-4105-9b6c-4b97010d17c6', {
    headers: {
      authorization: '123',
    },
  });
  expect(res.status).toBe(200);
});

test('PUT /orgs/{orgId}', async () => {
  let status;
  let res;
  try {
    res = await axios.put(url + '/orgs/4ada500d-eb71-4105-9b6c-4b97010d17c6', {
      name: 'Amazon',
      description: 'new description'
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
  expect(status).toBe(200);
  expect(res?.data.rows[0].description)
    .toBe('new description');
});

test('GET /projects/{projectId}/tickets', async () => {
  const res = await axios
    .get(url + '/projects/f00f5603-d518-46e4-a8e5-1326b3bf19df/tickets', {
      headers: {
        authorization: '123',
      },
    });
    expect(res.status).toBe(200);
});

test('POST /projects/{projectId}/tickets', async () => {
  let status;
  let res;
  try {
    res = await axios.post(url + '/projects/f00f5603-d518-46e4-a8e5-1326b3bf19df/tickets', {
      title: 'new title',
      priority: 'low',
      description: 'new description'
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
  expect(status).toBe(201);
});