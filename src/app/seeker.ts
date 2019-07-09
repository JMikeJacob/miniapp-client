import { Tag } from './tag'

export class Seeker {
    id: number | null
    email: string
    password?: string
    last_name: string
    lastname?: string
    first_name: string
    firstname?: string
    contact_no?: string
    contact?: string
    salary?: number
    resume?: string
    gender?: string
    tags?: Tag[]
}
