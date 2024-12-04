import { fromHono } from "chanfana";
import { Hono } from "hono";
import { TaskFetch } from "./endpoints/taskFetch";
import {supabaseMiddleware} from "./middleware/supabase";

// Start a Hono app
const app = new Hono<{ Bindings: Env}>();

app.use(supabaseMiddleware)

// Setup OpenAPI registry
const openapi = fromHono(app, {
	docs_url: "/",
});

// Register OpenAPI endpoint
openapi.get("/api/tasks/:taskSlug", TaskFetch);

// Export the Hono app
export default app;
