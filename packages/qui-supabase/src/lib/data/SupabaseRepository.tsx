import { DataRepository } from "@greenstones/qui-core";
import { SupabaseClient } from "@supabase/supabase-js";
import { Identifiable } from "./Identifiable";

export class SupabaseRepository<
  T extends Record<string, any>,
  Id extends Record<string, any> = Identifiable,
  CreateType = Omit<T, keyof Id> & Partial<Id>,
  UpdateType = Partial<T>
> implements DataRepository<T, Id, CreateType, UpdateType>
{
  private table: string;
  private supabase: SupabaseClient;
  private primaryKeys: (keyof Id)[];

  constructor(
    supabase: SupabaseClient,
    tableName: string,
    primaryKeys: (keyof Id)[] = ["id"]
  ) {
    this.table = tableName;
    this.supabase = supabase;
    this.primaryKeys = primaryKeys;
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
  async findById(id: Id): Promise<T> {
    const _id = pick(id, this.primaryKeys);
    const { data } = await this.supabase
      .from(this.table)
      .select()
      .match(_id)
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
  async update(id: Id, item: UpdateType): Promise<T> {
    const _id = pick(id, this.primaryKeys);
    const { data } = await this.supabase
      .from(this.table)
      .update(item)
      .match(_id)
      .select()
      .single()
      .throwOnError();

    return data;
  }

  // Delete an entity
  async delete(id: Id): Promise<boolean> {
    const _id = pick(id, this.primaryKeys);
    await this.supabase.from(this.table).delete().match(_id).throwOnError();
    return true;
  }
}

function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}
