export interface TransactionStat {
    date: string;
    day_name: string;
    total_order: number;
    total_invoice: string;
}

export interface TransactionStatsParams {
    site_id: number;
    start_time: string; // Format YYYY-MM-DD
    end_time: string;   // Format YYYY-MM-DD
}