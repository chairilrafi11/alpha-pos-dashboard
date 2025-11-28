export interface LoginResponse {
    access_token: string;
    token_type: string;
    expired_at: string;
}

export interface UserProfileResponse {
    user: User
    group: Group
    role: Role
    shifting_status: ShiftingStatus
}

export interface User {
    id: number
    site_id: number
    name: string
    email: string
    gender: string
    dob: any
    phone: string
    address: string
    created_at: string
    updated_at: any
    user_doc_detail: any[]
}

export interface Group {
    id: number
    name: string
    email: string
    phone: any
    address: any
    created_at: string
    updated_at: any
    site: Site[]
}

export interface Site {
    id: number
    business_type_id: number
    business_type_name: string
    name: string
    email: string
    phone: any
    address: any
    faktur_prefix: any
    return_prefix: any
    created_at: string
    updated_at: any
    doc_detail: any
    workflow: Workflow[]
    payment_list: PaymentList[]
}

export interface Workflow {
    no: number
    name: string
}

export interface PaymentList {
    id: number
    type: string
    name: string
    created_at: string
    updated_at: any
}

export interface Role {
    id: number
    name: string
    created_at: string
    updated_at: any
    access: Access[]
}

export interface Access {
    id: number
    menu: string
    path: string
    is_create: boolean
    is_read: boolean
    is_update: boolean
    is_delete: boolean
    is_maintenece: boolean
    created_at: string
    updated_at: any
}

export interface ShiftingStatus {
    id: any
    site_id: number
    opening_at: any
    closing_at: any
    status: any
    opening_amount: string
    closing_amount: string
    total_invoice: string
    total_bayar: string
    revenue: string
    selisih: string
    created_at: any
    updated_at: any
    is_eligible: boolean
}


