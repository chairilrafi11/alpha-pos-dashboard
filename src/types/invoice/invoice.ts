export interface Invoice {
  id: number
  no_invoice: string
  branch_id: number
  branch_name: string
  order_name: string
  invoice_type: string
  transaction_date: string
  total_invoice: string
  created_by: string
  updated_by: any
  created_at: string
  updated_at: any
}

export interface InvoiceDetail {
  id: number
  no_invoice: string
  order_id: number
  order_name: string
  invoice_type: string
  promo_code: any
  total_item: number
  total_price: string
  total_discount: string
  total_invoice: string
  total_payment: string
  total_change: string
  payment_id: number
  payment_name: string
  transaction_date: string
  description: any
  branch_id: number
  branch_name: string
  branch_address: string
  branch_phone: string
  created_by: string
  updated_by: any
  created_at: string
  updated_at: any
  invoice_product_details: InvoiceProductDetail[]
}

export interface InvoiceProductDetail {
  id: number
  product_id: number
  product_name: string
  buy_price: string
  sell_price: string
  qty: string
  discount_price: string
  amount: string
  total_amount: string
  created_at: string
  updated_at: any
}
