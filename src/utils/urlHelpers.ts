import { BaseParams } from "@/types/shared/commonModel";

export function buildQueryParams(params: BaseParams): string {
    const queryParams = new URLSearchParams();

    for (const key in params) {
        if (Object.prototype.hasOwnProperty.call(params, key)) {

            const value = params[key as keyof BaseParams];

            if (value !== null && value !== undefined) {
                const stringValue = String(value);

                if (stringValue !== "") {
                    queryParams.append(key, stringValue);
                }
            }
        }
    }

    return queryParams.toString();
}