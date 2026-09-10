import http from "k6/http";
import { sleep, check } from "k6";
export const options = {
  vus: 30,
  duration: "30s",
  thresholds: {
    http_req_duration: ["p(95)<300"], //local servert p95 ni 300ms ees baga baih nuhtsul
    http_req_failed: ["rate<0.01"],
  },
};
export default function () {
  const res = http.get("http://127.0.0.1:3000/api/docs-json");
  check(res, { "status 200 байна": (r) => r.status === 200 });
  sleep(1);
}
