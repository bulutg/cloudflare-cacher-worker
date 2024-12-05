# Cloudflare Cacher Worker with Cache API and Supabase

A lightweight Cloudflare Worker project integrating Supabase and the Cache API to efficiently manage caching and serverless database interactions.

This project is designed for developers seeking to leverage the [Cloudflare global network cache](https://developers.cloudflare.com/workers/runtime-apis/cache/) for optimized performance and reduce database load while utilizing Supabase for simple and scalable backend integration.

Based on: https://github.com/cloudflare/workers-sdk/tree/main/packages/create-cloudflare/templates/openapi

## Features
- Cache API Utilization: Implement caching for improved response times and reduced requests to the origin (Supabase).
- Supabase Integration: Simplify data management with Supabase's powerful backend-as-a-service.
- Serverless Deployment: Run entirely on Cloudflare Workers for minimal infrastructure overhead.

## Get started

1. Sign up for [Cloudflare Workers](https://workers.dev). The free tier is more than enough for most use cases.
2. Clone this project and install dependencies with `npm install`
3. Run `wrangler login` to login to your Cloudflare account in wrangler
4. Run `wrangler deploy` to publish the API to Cloudflare Workers

## Project structure

1. Your main router is defined in `src/index.ts`.
2. Each endpoint has its own file in `src/endpoints/`.
3. For more information read the [chanfana documentation](https://chanfana.pages.dev/) and [Hono documentation](https://hono.dev/docs).

## Development

1. Run `wrangler dev` to start a local instance of the API.
2. Open `http://localhost:8787/` in your browser to see the Swagger interface where you can try the endpoints.
3. Changes made in the `src/` folder will automatically trigger the server to reload, you only need to refresh the Swagger interface.
