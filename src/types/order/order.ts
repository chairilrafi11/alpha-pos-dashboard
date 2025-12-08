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

export interface OrderDetail {
    id: number
    branch_id: number
    branch_name: string
    branch_address: string
    branch_phone: string
    merchant_id: number
    merchant_name: string
    user_id: number
    customer_name: string
    description: string
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
    order_details: OrderProductDetail[]
    workflow: any
    OrderIDExternal: number
}

export interface OrderProductDetail {
    id: number
    order_id: number
    product_id: number
    product_name: string
    qty: number
    buy_price: number
    sell_price: number
    amount: number
}
