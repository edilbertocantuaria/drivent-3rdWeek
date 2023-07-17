import { ApplicationError } from "@/protocols";

export function notListHotelsError(): ApplicationError {
    return {
        name: 'NotListHotelsError',
        message: 'Can not list hotels at this moment'
    }
}