export interface IBaseRepository<T> {
   save(data: Partial<T>): Promise<T>;
}
