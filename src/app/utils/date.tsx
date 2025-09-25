export function isValidDateRange(s?: string | null, e?: string | null): boolean {
    if (!s || !e) return false;
    return new Date(e) >= new Date(s);
}