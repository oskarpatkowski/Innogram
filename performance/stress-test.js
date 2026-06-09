/* eslint-env k6 */
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'],
    http_req_failed: ['rate<0.01'],
  },
};

const BASE_URL = 'http://localhost:8080';

export default function () {
  const mainRes = http.get(`${BASE_URL}/`);
  check(mainRes, {
    'main page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  const loginPayload = JSON.stringify({
    //global k6 variable
    // eslint-disable-next-line no-undef
    email: `user${__VU}@example.com`,
    password: 'password123',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);
  check(loginRes, {
    'login endpoint status is 201 or 401': (r) => [201, 401].includes(r.status),
  });

  sleep(1);
}
