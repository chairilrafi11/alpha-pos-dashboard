export interface Product {
  id: number
  branch_id: number
  branch_name: string
  name: string
  buy_price: string
  sell_price: string
  image: string
  status: string
  created_at: string
  updated_at: any
}

export interface ProductDetail {
  barcode: any
  merchant_id: number
  branch_id: number
  branch_name: string
  category_id: number
  category_name: string
  created_at: string
  description: any
  external_id: string
  buy_price: number
  sell_price: number
  id: number
  image: string
  name: string
  qty_stock: number
  satuan_kecil: string
  status: string
  updated_at: string
  merchant_name: string
}
