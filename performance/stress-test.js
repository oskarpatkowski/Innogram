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
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: false }],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)', 'p(99)'],
};

const PORT = __ENV.CORE_PORT || __ENV.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default function () {
  const mainRes = http.get(`${BASE_URL}/`);
  check(mainRes, {
    'main page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  // Use test@test.com and test2@test.com interchangeably for some variety, 
  // or just stick to a few known users.
  const email = __VU % 2 === 0 ? 'test2@test.com' : 'test@test.com';

  const loginPayload = JSON.stringify({
    email: email,
    password: 'password',
    userAgent: 'k6-stress-test',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);
  check(loginRes, {
    'login endpoint status is 200, 401 or 404': (r) => [200, 401, 404].includes(r.status),
  });

  sleep(1);
}
