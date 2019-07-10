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
    salary_per_month?: number
    resume?: string
    gender?: string
    birthdate?: number
    education?: string
    level?: string
    tags?: any[]
    skills?: Tag[]
    fields?: Tag[]

    constructor() {
        this.id = null
        this.email = ""
        this.last_name = ""
        this.first_name = ""
    }
}
