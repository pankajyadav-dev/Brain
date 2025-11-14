export type IResponse = {
    message: string,
    token?: string,
    error?: string[] | { field: string, message: string }[]
}

export type ClientResponse = {
    success: boolean,
    message: string,
    error?: string[] | { field: string, message: string }[]
}