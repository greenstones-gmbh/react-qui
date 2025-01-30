export type DefaultCreateType<T, Id> = Omit<T, keyof Id> & Partial<Id>;
export type DefaultUpdateType<T> = Partial<T>;

export interface DataRepository<
  Type extends Record<string, any>,
  ID extends Record<string, any>,
  CreateType = DefaultCreateType<Type, ID>,
  UpdateType = DefaultUpdateType<Type>
> {
  create(item: CreateType): Promise<Type>;
  findById(id: ID): Promise<Type>;
  update(id: ID, item: UpdateType): Promise<Type>;
  delete(id: ID): Promise<boolean>;
}
