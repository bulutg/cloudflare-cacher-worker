import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskFetch } from "./endpoints/taskFetch";
import { TaskList } from "./endpoints/taskList";

// Start a Hono app
const app = new Hono();

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoints
openapi.get("/api/tasks", TaskList);
openapi.get("/api/tasks/:taskSlug", TaskFetch);

// Export the Hono app
export default app;
