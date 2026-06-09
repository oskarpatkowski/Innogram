import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3, 
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
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
    email: 'testuser@example.com',
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
