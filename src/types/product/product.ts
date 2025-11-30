export interface Product {
    id: number
    category_id: number
    site_id: number
    external_id: string
    status: string
    barcode: any
    name: string
    satuan_kecil: string
    harga_beli: number
    harga_jual: number
    image: string
    description: any
    qty_stock: number
    created_at: string
    updated_at: string
    category_name: string
}
