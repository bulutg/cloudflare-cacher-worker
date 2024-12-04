import { Bool, OpenAPIRoute, Str } from "chanfana";
import { z } from "zod";
import { Task } from "../types";
import { SupabaseClient} from '@supabase/supabase-js';

export class TaskFetch extends OpenAPIRoute {
	schema = {
		// This categorizes the endpoint under the Tasks group.
		// Tags help organize endpoints in the API documentation.
		tags: ["Tasks"],
		summary: "Get a single Task by slug",
		request: {
			params: z.object({
				taskSlug: Str({ description: "Task slug" }),
			}),
		},
		responses: {
			"200": {
				description: "Returns a single task if found",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								result: z.object({
									task: Task,
								}),
							}),
						}),
					},
				},
			},
			"404": {
				description: "Task not found",
				content: {
					"application/json": {
						schema: z.object({
							series: z.object({
								success: Bool(),
								error: Str(),
							}),
						}),
					},
				},
			},
		},
	};

	// Cache API implementation adapted from Cloudflare Workers example:
	// https://developers.cloudflare.com/workers/examples/cache-api/
	async handle(c) {
		// Get validated data
		const validatedData = await this.getValidatedData<typeof this.schema>();

		// Get the request URL from Hono context
		const cacheUrl = new URL(c.req.url);

		// Construct the cache key from the cache URL
		const cacheKey = new Request(cacheUrl.toString(), c.req.raw);
		const cache = caches.default;

		// Check whether the value is already available in the cache
		// if not, you will need to fetch it from origin, and store it in the cache
		let response = await cache.match(cacheKey);

		if (!response) {
			console.log(
				`Response for request url: ${c.req.url} not present in cache. Fetching and caching request.`,
			);

			// If not in cache, get it from origin

			// Retrieve the validated slug
			const { taskSlug } = validatedData.params;

			const supabase: SupabaseClient = c.get('supabase');

			const { data, error } = await supabase.from("tasks").select('*').eq('taskSlug', taskSlug)
				.single();

			if (error) throw error;

			response = new Response(JSON.stringify(data), {
				headers: {
					"Content-Type": "application/json",
				},
			});

			// Must use Response constructor to inherit all of response's fields
			response = new Response(response.body, response);

			// Cache API respects Cache-Control headers. Setting s-max-age to 604800
			// will limit the response to be in (s)hared cache for 604800 seconds max

			// Any changes made to the response here will be reflected in the cached value
			response.headers.append("Cache-Control", "s-maxage=604800");

			// Clone the response before caching because the body can only be read once
			c.executionCtx.waitUntil(cache.put(cacheKey, response.clone()));
		} else {
			console.log(`Cache hit for: ${c.req.url}.`);
		}
		return response;
	}
}
