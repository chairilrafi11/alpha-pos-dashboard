export interface Invoice {
  id: number
  no_invoice: string
  branch_id: number
  branch_name: string
  order_name: string
  invoice_type: string
  transaction_date: string
  amount: string
  created_by: string
  updated_by: any
  created_at: string
  updated_at: any
}
