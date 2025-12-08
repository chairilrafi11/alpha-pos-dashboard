import { OrderProductDetail } from "@/types/order/order";
import { formatIDR } from "@/utils/currencyFormatter";

export default function OrderDetailTable({ details }: { details: OrderProductDetail[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-800">
      <table className="min-w-full text-left text-gray-700 dark:text-gray-400">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr className="border-b border-gray-100 dark:border-gray-800">
            <th className="px-5 py-3 text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
              No
            </th>
            <th className="px-5 py-3 text-xs font-medium whitespace-nowrap text-gray-500 dark:text-gray-400">
              Product Name
            </th>
            <th className="px-5 py-3 text-center text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
              Quantity
            </th>
            <th className="px-5 py-3 text-center text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
              Buy Price
            </th>
            <th className="px-5 py-3 text-center text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
              Sell Price
            </th>
            <th className="px-5 py-3 text-right text-sm font-medium whitespace-nowrap text-gray-700 dark:text-gray-400">
              Total
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
          {
            details?.map((detail, index) => (
              <tr key={index}>
                <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {index + 1}
                </td>
                <td className="px-5 py-3 text-sm text-gray-500 dark:text-gray-400">
                  {detail.product_name}
                </td>
                <td className="px-5 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  {detail.qty}
                </td>
                <td className="px-5 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  {formatIDR(detail.buy_price)}
                </td>
                <td className="px-5 py-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  {formatIDR(detail.sell_price)}
                </td>
                <td className="px-5 py-3 text-right text-sm text-gray-500 dark:text-gray-400">
                  {formatIDR(detail.amount)}
                </td>
              </tr>
            ))
          }

        </tbody>
      </table>
    </div>
  );
}
