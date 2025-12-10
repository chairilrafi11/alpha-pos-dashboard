import { OrderStatus } from "./OrderStatus"
import { TopProduct } from "./topProduct"

export interface DashboardAdminMetrics {
  platform_summary: PlatformSummary
  order_status: OrderStatus[]
  sessions_by_platform: SessionsByPlatform
  growth_metrics: GrowthMetrics
  sales_chart_data: SalesChartDaum[]
  top_merchants: TopMerchant[]
  top_products: TopProduct[]
  system_status: SystemStatus
}

export interface PlatformSummary {
  total_users: number
  total_merchants: number
  total_branches: number
  total_transactions: number
  total_transaction_value: number
  total_category: number
  total_products: number
  total_suppliers: number
}

export interface SessionsByPlatform {
  android: number
  ios: number
  web: number
}

export interface GrowthMetrics {
  new_users_last_30_days: number
  user_growth_percentage: number
  new_merchants_this_month: number
  merchant_growth_percentage: number
  gmv_growth_percentage: number
}

export interface SalesChartDaum {
  date: string
  total_value: string
}

export interface TopMerchant {
  site_id : number
  site_name: string
  group_id: number
  group_name: string
  total_sales: number
  transaction_count: number
}

export interface SystemStatus {
  api_latency_ms: number
  error_rate: number
  last_downtime_at: string
}
