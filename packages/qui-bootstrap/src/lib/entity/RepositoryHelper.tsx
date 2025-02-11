import { DataObject, Identifiable, DataRepository } from "@clickapp/qui-core";

export class RepositoryHelper<
  IdentifiableType extends Identifiable,
  FormData extends Record<string, any>,
  DataObjectType extends DataObject,
  DataObjectCreateType,
  DataObjectUpdateType
> {
  repository: DataRepository<
    DataObjectType,
    IdentifiableType,
    DataObjectCreateType,
    DataObjectUpdateType
  >;
  updateTransform: (formData: FormData) => Promise<DataObjectUpdateType>;
  createTransform: (formData: FormData) => Promise<DataObjectCreateType>;
  formTransform: (value: DataObjectType) => Promise<FormData>;

  constructor(
    repository: DataRepository<
      DataObjectType,
      IdentifiableType,
      DataObjectCreateType,
      DataObjectUpdateType
    >,
    updateTransform: (formData: FormData) => Promise<DataObjectUpdateType>,
    createTransform: (formData: FormData) => Promise<DataObjectCreateType>,
    formTransform: (value: DataObjectType) => Promise<FormData>
  ) {
    this.repository = repository;
    this.updateTransform = updateTransform;
    this.createTransform = createTransform;
    this.formTransform = formTransform;
  }

  async update(id: IdentifiableType, formData: FormData) {
    const v: DataObjectUpdateType = await this.updateTransform(formData);
    const result: DataObjectType = await this.repository.update(id, v);
    return result;
  }

  async create(formData: FormData) {
    const v: DataObjectCreateType = await this.createTransform(formData);
    const result: DataObjectType = await this.repository.create(v);
    return result;
  }

  async findById(id: IdentifiableType) {
    const v: DataObjectType = await this.repository.findById(id);
    const result: FormData = await this.formTransform(v);
    return result;
  }
}
