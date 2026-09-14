import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "5s", target: 5 },
    { duration: "10s", target: 5 },
    { duration: "5s", target: 0 },
  ],
  thresholds: {
    http_req_failed: ["rate<0.01"],
    http_req_duration: ["p(95)<3000"],
  },
};

const BASE_URL = "https://test.k6.io";

export default function () {
  // 1. Main Homepage
  const homeRes = http.get(BASE_URL);
  check(homeRes, {
    "Homepage is 200": (r) => r.status === 200,
  });
  sleep(1);

  // 2. Contacts Page
  const contactsRes = http.get(`${BASE_URL}/contacts.php`);
  check(contactsRes, {
    "Contacts page is 200": (r) => r.status === 200,
  });
  sleep(1);

  // 3. Pi Calculation Page
  const piRes = http.get(`${BASE_URL}/pi.php`);
  check(piRes, {
    "Pi page is 200": (r) => r.status === 200,
  });
  sleep(1);
}
