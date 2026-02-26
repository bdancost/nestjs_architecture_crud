export class EntityNotFoundError extends Error {
  constructor(entity: string, id: number) {
    super(`Entity ${entity} with ID ${id} not found`);
    this.name = 'EntityNotFoundError';
  }
}
