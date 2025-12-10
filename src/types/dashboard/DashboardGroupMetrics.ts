import { BaseModel } from "../shared/baseModel"
import { OrderStatus } from "./OrderStatus"
import { TopProduct } from "./topProduct"

export interface DashboardGroupMetrics {
    group: BaseModel
    site: BaseModel
    summary: GroupSummary
    order_status: OrderStatus[]
    site_performance: SitePerformance[]
    top_products: TopProduct[]
}

export interface GroupSummary {
    net_revenue: number
    net_revenue_change: string
    total_orders: number
    total_orders_change: string
    average_order_value: number
    aov_change: string
    total_discount: number
    total_discount_change: string
    total_gross_sales: number
    total_gross_sales_change: string
    total_items_sold: number
    total_items_sold_change: string
    site_count: number
    total_users: number
    total_products: number
}

export interface SitePerformance {
    site_id: number
    site_name: string
    net_revenue: number
    total_orders: number
    average_order_value: number
    total_discount: number
    net_revenue_change: number
    aov_change: number
    total_items_sold: number
}
