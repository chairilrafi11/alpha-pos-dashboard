export interface AlertPorps {
    title: string;
    message: string;
    type: "success" | "error" | "warning" | "info";
    isShowButton: boolean;
    onClose: () => void;
}