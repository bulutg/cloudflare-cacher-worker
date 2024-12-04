import {createClient, SupabaseClient} from "@supabase/supabase-js";
import { createMiddleware } from 'hono/factory'

let supabase: SupabaseClient = null;

export const supabaseMiddleware = createMiddleware<{Bindings: Env, Variables: {
        supabase: SupabaseClient
    }}>(async (c, next) => {
    console.log(c);
    if (!supabase) {
        // TODO: fix race condition
        c.set('supabase', createClient(
            c.env.SUPABASE_URL,
            c.env.SUPABASE_KEY
        ));
    }
    await next()
})
