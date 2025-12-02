
export function getNoRow(index: number, currentPage: number, rowsPerPage: number ): number {
    return (currentPage - 1) * rowsPerPage + index + 1
}