import { vra } from "./vra.js";

export class vr {
    static validate(name: string, value: unknown, formValues: unknown, rule: string): string {
        const rules = rule.split("|");

        if (rules.includes("required")) {
            if (value === null || value === undefined || value === "" || (typeof value === "string" && value.trim() === "")) {
                return "This field is required.";
            }
        }

        if (rules.includes("string")) {
            if (typeof value !== "string") {
                return `The field (${name}) must be a string.`;
            }

            const min = vra.getMin(rule);
            if (min && value.length < min) {
                return `The value must be at least ${min} characters.`;
            }

            const max = vra.getMax(rule);
            if (max && value.length > max) {
                return `The value may not be greater than ${max} characters.`;
            }
        }

        if (rules.includes("email")) {
            if (typeof value !== "string") {
                return "Invalid email.";
            }

            // Basic but robust regex for email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                return "Invalid email";
            }
        }

        const inList = vra.getInList(rule);
        if (inList.length > 0) {
            if (typeof value !== "string") {
                return "The field must be a valid option.";
            }
            if (!inList.includes(value)) {
                return 'The value is invalid';
            }
        }


        if (rules.includes("file") && value !== null) {
            // Allow existing file URLs (string values)
            if (rules.includes("aurl")) {
                if (typeof value === "string") {
                    return "";
                }
            } else {
                // It should be a file
                if (!(value instanceof File)) {
                    return `Please upload a valid file for (${name}).`;
                }
            }
        }

        if (rules.includes("image") && value !== null) {
            // Allow uploaded File objects that are image types
            if (value instanceof File) {
                if (!value.type.startsWith("image/")) {
                    return `The file for (${name}) must be an image.`;
                }
                return "";
            }


        }

        const maxSize = vra.getMaxSize(rule);
        if (maxSize && value instanceof File) {
            const maxBytes = maxSize * 1024 * 1024;
            if (value.size > maxBytes) {
                return `The file size for (${name}) must not exceed ${maxSize} MB.`;
            }
        }

        const sameField = vra.getSame(rule);
        if (sameField) {
            const otherValue =
                (formValues as any)?.[sameField] ?? null;

            if (value !== otherValue) {
                return `The ${name} field must match ${sameField}.`;
            }
        }

        return "";
    }
}
