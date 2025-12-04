
export interface ProductDataRequest {
    category_id: number;
    external_id: string;
    barcode: string;
    name: string;
    satuan_kecil: string;
    harga_beli: number;
    harga_jual: number;
    qty_stock: number;
    description: string;
    image: string;
}