import { ZodIssue } from "zod";

export function formatZodErrors(errors: ZodIssue[]): string {
    return errors.map(e => e.message).join(', ');
}