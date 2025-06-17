export interface FetchCustomerParams {
    page:number,
    limit:number,
    search:string,
    location?:[number,number],
    filter?:string
}
