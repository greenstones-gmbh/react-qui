export interface DataRepository<
  T extends Identifiable,
  Identifiable extends Record<string, any>,
  CreateType = Omit<T, keyof Identifiable> & Partial<Identifiable>,
  UpdateType = Partial<T>
> {
  create(item: CreateType): Promise<T>;
  findById(id: Identifiable): Promise<T>;
  update(id: Identifiable, item: UpdateType): Promise<T>;
  delete(id: Identifiable): Promise<boolean>;
}
