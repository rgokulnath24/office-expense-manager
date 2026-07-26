import { supabase } from "./supabase";

export async function login(email: string, password: string) {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}
