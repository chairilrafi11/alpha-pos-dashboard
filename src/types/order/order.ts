export interface Order {
    id: number
    branch_id: number
    branch_name: string
    user_id: number
    customer_name: string
    total_item: number
    total_amount: string
    status: string
    workflow_no: number
    workflow_name: string
    transaction_date: string
    created_by: string
    updated_by: string
    created_at: string
    updated_at: string
    OrderIDExternal: number
}
