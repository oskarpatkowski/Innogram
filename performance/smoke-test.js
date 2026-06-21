import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 3, 
  duration: '30s',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: [{ threshold: 'rate<0.01', abortOnFail: false }],
  },
  summaryTrendStats: ['avg', 'min', 'med', 'max', 'p(90)', 'p(95)'],
};

const PORT = __ENV.CORE_PORT || __ENV.PORT || 3000;
const BASE_URL = `http://localhost:${PORT}`;

export default function () {
  const mainRes = http.get(`${BASE_URL}/`);
  check(mainRes, {
    'main page status is 200': (r) => r.status === 200,
  });

  sleep(1);

  const loginPayload = JSON.stringify({
    email: 'test@test.com',
    password: 'password',
    userAgent: 'k6-smoke-test',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const loginRes = http.post(`${BASE_URL}/auth/login`, loginPayload, params);

  if (![200, 401, 404].includes(loginRes.status)) {
    console.error(`Login Failed! Status: ${loginRes.status} | Body: ${loginRes.body}`);
  }

  check(loginRes, {
    'login endpoint status is 200, 401 or 404': (r) => [200, 401, 404].includes(r.status),
  });
  sleep(1);
}