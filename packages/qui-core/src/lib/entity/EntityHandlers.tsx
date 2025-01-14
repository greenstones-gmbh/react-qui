export interface EntityHandlers<
  EntityKey,
  Entity extends EntityKey & EntityFields,
  EntityFields extends Record<string, any>
> {
  insert: (fields: EntityFields) => Promise<Entity>;
  update: (entityKey: EntityKey, fields: EntityFields) => Promise<Entity>;
  remove: (entityKey: EntityKey) => Promise<void>;
  findById: (entityKey: EntityKey) => Promise<Entity>;
  copyFields: (entityKey: EntityKey) => Promise<EntityFields>;
}
