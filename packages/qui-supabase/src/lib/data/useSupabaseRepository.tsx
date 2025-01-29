import { useMemo } from "react";
import { useSupabaseClient } from "../SupabaseContext";
import { SupabaseRepository } from "./SupabaseRepository";

export function useSupabaseRepository<
  T extends Identifiable,
  Identifiable extends Record<string, any> = { id: string },
  CreateType = Omit<T, keyof Identifiable> & Partial<Identifiable>,
  UpdateType = Partial<T>
>(table: string) {
  const supabaseClient = useSupabaseClient();

  return useMemo(
    () =>
      new SupabaseRepository<T, Identifiable, CreateType, UpdateType>(
        supabaseClient,
        table
      ),
    [supabaseClient, table]
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
>(table: string) {
  type t1 = DatabaseType["public"]["Tables"][TableType]["Row"] & Identifiable;
  type t2 = DatabaseType["public"]["Tables"][TableType]["Insert"];
  type t3 = DatabaseType["public"]["Tables"][TableType]["Update"];

  const repository = useSupabaseRepository<t1, Identifiable, t2, t3>(table);
  return repository;
}
