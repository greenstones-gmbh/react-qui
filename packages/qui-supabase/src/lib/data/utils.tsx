import { SupabaseClient } from "@supabase/supabase-js";

export async function getById<Type>(
  supabaseClient: SupabaseClient,
  from: string,
  id: string
) {
  const { data } = await supabaseClient
    .from(from)
    .select("*")
    .eq("id", id)
    .single()
    .throwOnError();
  return data as Type;
}

export async function update<Type, ReturnType = Type>(
  supabaseClient: SupabaseClient,
  from: string,
  id: string,
  data: Type
) {
  const { data: value } = await supabaseClient
    .from(from)
    .update(data)
    .eq("id", id)
    .select()
    .single()
    .throwOnError();
  return value as ReturnType;
}

export async function insert<Type, ReturnType = Type>(
  supabaseClient: SupabaseClient,
  from: string,
  data: Type
) {
  const { data: value } = await supabaseClient
    .from(from)
    .insert(data)
    .select()
    .single()
    .throwOnError();
  return value as ReturnType;
}

export async function remove<Type>(
  supabaseClient: SupabaseClient,
  from: string,
  id: string
) {
  const { data: value } = await supabaseClient
    .from(from)
    .delete()
    .eq("id", id)
    .select()
    .single()
    .throwOnError();

  return value as Type;
}
