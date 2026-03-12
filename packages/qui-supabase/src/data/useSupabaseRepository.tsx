import { useMemo } from "react";
import { useSupabaseClient } from "../SupabaseContext";
import { SupabaseRepository } from "./SupabaseRepository";

export function useSupabaseRepository<
  T extends Id,
  Id extends Record<string, any> = { id: string },
  CreateType = Omit<T, keyof Id> & Partial<Id>,
  UpdateType = Partial<T>
>(table: string, primaryKeys: (keyof Id)[] = ["id"]) {
  const supabaseClient = useSupabaseClient();

  return useMemo(
    () =>
      new SupabaseRepository<T, Id, CreateType, UpdateType>(
        supabaseClient,
        table,
        primaryKeys
      ),
    [supabaseClient, table, primaryKeys]
  );
}

type Table = {
  Row: Record<string, any>;
  Insert: Record<string, any>;
  Update: Record<string, any>;
};

type Database = {
  public: {
    Tables: { [key: string]: Table };
  };
};

export function useSupabaseTypedRepository<
  DatabaseType extends Database,
  TableType extends keyof DatabaseType["public"]["Tables"],
  Identifiable extends Record<string, any> = { id: string }
>(table: string, primaryKeys: (keyof Identifiable)[] = ["id"]) {
  type t1 = DatabaseType["public"]["Tables"][TableType]["Row"] & Identifiable;
  type t2 = DatabaseType["public"]["Tables"][TableType]["Insert"];
  type t3 = DatabaseType["public"]["Tables"][TableType]["Update"];

  const repository = useSupabaseRepository<t1, Identifiable, t2, t3>(
    table,
    primaryKeys
  );
  return repository;
}
