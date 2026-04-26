import { Hono } from "hono";
import { registry } from "./actors.ts";

const app = new Hono();
app.all("/api/rivet/actors*", (c) => registry.handler(c.req.raw));

const RIVET_ENDPOINT = process.env.RIVET_ENDPOINT || "http://rivet.railway.internal";

app.all("/api/rivet/*", async (c) => {
  const path = c.req.path.replace(/^\/api\/rivet/, "");
  const url = `${RIVET_ENDPOINT}/api/rivet${path}`;
  
  const response = await fetch(url, {
    method: c.req.method,
    headers: c.req.raw.headers,
    body: c.req.method !== "GET" && c.req.method !== "HEAD" ? await c.req.text() : undefined,
  });

  return new Response(response.body, {
    status: response.status,
    headers: response.headers,
  });
});

export default app;
