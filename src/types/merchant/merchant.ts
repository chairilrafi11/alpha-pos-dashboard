export interface Merchant {
    id: number
    group_id: number
    group_name: string
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
    doc_detail: any[]
}
