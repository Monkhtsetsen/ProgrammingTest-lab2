import http from "k6/http";
import { check, sleep } from "k6";
import encoding from "k6/encoding";

export const options = {
  stages: [
    { duration: "10s", target: 5 }, // Ramp up to 5 virtual users
    { duration: "15s", target: 5 }, // Stay at 5 virtual users
    { duration: "5s", target: 0 }, // Ramp down to 0
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"], // Less than 1% failed requests
    http_req_duration: ["p(95)<3000"], // 95% of requests must finish within 3 seconds
  },
};

const BASE_URL = "https://httpbin.org";

export default function () {
  // Step 1: Basic Authentication Test
  const credentials = "myuser:mypassword";
  const encodedCredentials = encoding.b64encode(credentials);

  const authRes = http.get(`${BASE_URL}/basic-auth/myuser/mypassword`, {
    headers: {
      Authorization: `Basic ${encodedCredentials}`,
    },
  });

  check(authRes, {
    "Auth status is 200": (r) => r.status === 200,
    "Auth response confirmed": (r) => r.json("authenticated") === true,
  });

  sleep(1);

  // Step 2: Search / Submit Data (POST Request)
  const payload = JSON.stringify({
    query: "k6 performance test",
    category: "load testing",
  });

  const postParams = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const postRes = http.post(`${BASE_URL}/post`, payload, postParams);

  check(postRes, {
    "POST status is 200": (r) => r.status === 200,
    "Payload received back": (r) =>
      r.json("json.query") === "k6 performance test",
  });

  sleep(1);

  // Step 3: Simulate Server Latency (Delay Endpoint)
  const delayRes = http.get(`${BASE_URL}/delay/1`);

  check(delayRes, {
    "Delayed request status is 200": (r) => r.status === 200,
  });

  sleep(2);
}
