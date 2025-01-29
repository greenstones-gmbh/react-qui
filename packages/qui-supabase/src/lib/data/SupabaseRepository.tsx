import { DataRepository } from "@clickapp/qui-core";
import { SupabaseClient } from "@supabase/supabase-js";

export class SupabaseRepository<
  T extends Identifiable,
  Identifiable extends Record<string, any> = { id: string },
  CreateType = Omit<T, keyof Identifiable> & Partial<Identifiable>,
  UpdateType = Partial<T>
> implements DataRepository<T, Identifiable, CreateType, UpdateType>
{
  private table: string;
  private supabase: SupabaseClient;

  constructor(supabase: SupabaseClient, tableName: string) {
    this.table = tableName;
    this.supabase = supabase;
  }

  // Create a new entity
  async create(item: CreateType): Promise<T> {
    const { data } = await this.supabase
      .from(this.table)
      .insert(item)
      .select()
      .single()
      .throwOnError();

    return data;
  }

  // Find an entity by ID
  async findById(id: Identifiable): Promise<T> {
    const { data } = await this.supabase
      .from(this.table)
      .select()
      .match(id)
      .single()
      .throwOnError();
    return data;
  }

  // Find all entities
  async findAll(): Promise<T[]> {
    const { data } = await this.supabase
      .from(this.table)
      .select()
      .throwOnError();
    return data || [];
  }

  // Update an entity
  async update(id: Identifiable, item: UpdateType): Promise<T> {
    const { data } = await this.supabase
      .from(this.table)
      .update(item)
      .match(id)
      .select()
      .single()
      .throwOnError();

    return data;
  }

  // Delete an entity
  async delete(id: Identifiable): Promise<boolean> {
    await this.supabase.from(this.table).delete().match(id).throwOnError();
    return true;
  }
}
