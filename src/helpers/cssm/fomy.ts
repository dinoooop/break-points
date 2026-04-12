import { vr } from "../../bootstrap/vr/vr.js";
import { vri } from "../../bootstrap/vr/vri.js";
import config from "../../config.js";

type FieldConfig = Record<string, any>;
export class fomy {

    static setval(name: string, value: unknown) {
        switch (name) {
            case 'image':
                if (value instanceof FileList) {
                    console.log("YES");
                    const file = value[0]

                    if (file && file.type.startsWith('image/')) {
                        const fileUrl = URL.createObjectURL(file)
                        console.log("This is an image");
                        console.log("This is an image");

                        return { [name]: file, [name + '_url']: fileUrl }
                    } else {
                        console.warn(`Unsupported file type for ${name}:`, file?.type)
                        return { [name]: null, [name + '_url']: null }
                    }
                }
                return { [name]: null, [name + '_url']: null }

            default:
                return { [name]: value };
        }
    }

    static validateOne(
        name: string,
        formValues: Record<string, any>,
        rules: Record<string, any>
    ) {
        if (!rules[name]) {
            return null;
        }

        const value = formValues[name]
        const rule = rules[name]
        const error = vr.validate(name, value, formValues, rule)
        return { [name]: error }
    }

    static validateMany(formValues: any, ruleSet: Record<string, string>) {
        const updatedErrors: Record<string, string> = {}
        Object.entries(formValues).forEach(([name, value]) => {
            if (ruleSet[name]) {
                updatedErrors[name] = vr.validate(name, value, formValues, ruleSet[name])
            }
        })
        const allErrorsFalse = Object.values(updatedErrors).every(error => error === '')
        const firstError = vri.findFirstNonFalseValue(updatedErrors)
        return { firstError, updatedErrors, allErrorsFalse }
    }

    static getFormValues(fieldSet: FieldConfig, formName: string): Record<string, any> {
        const result: Record<string, any> = {};

        Object.entries(fieldSet).forEach(([key, value]) => {

            // if a default value for the form exists, use it
            const formValueKey = `${formName}Value`;
            if (formValueKey in value) {
                result[key] = value[formValueKey];
            } else {
                result[key] = null;
            }

        });

        return result;
    }

    static getDummyValues(fieldSet: FieldConfig): Record<string, any> {
        const result: Record<string, any> = {};

        Object.entries(fieldSet).forEach(([key, value]) => {
            if ('dummyValue' in value) {
                result[key] = value.dummyValue;
            }
        });

        return result;
    }

    static getFormValuesOrDummy(fieldSet: FieldConfig, formName: string): Record<string, any> {

        const formsWithDummyValues = ['create', 'login', 'contact']

        if (formsWithDummyValues.includes(formName)) {
            if (config.valuesType == 'dummy') {
                return this.getDummyValues(fieldSet);
            } else {
                return this.getFormValues(fieldSet, formName)
            }
        }

        return this.getFormValues(fieldSet, formName)
    }



    static getFormRules(fieldSet: FieldConfig, formName: string): Record<string, string> {
        const result: Record<string, string> = {};

        Object.entries(fieldSet).forEach(([key, value]) => {
            const ruleKey = `${formName}Rule`;
            if (ruleKey in value) {
                result[key] = value[ruleKey];
            }
        });

        return result;
    }

    // Select only fields for form then Add attr id, lable
    static refineFieldSet(fieldSet: FieldConfig, formName: string): FieldConfig {
        const updatedFieldSet: FieldConfig = {};

        Object.entries(fieldSet).forEach(([key, value]) => {
            const forms: string = value.forms || '';
            if (forms.split('|').includes(formName)) {
                const id = value.id || formName + '_' + key;
                const label = value.label || key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                updatedFieldSet[key] = { ...value, id, label };
            }
        });

        return updatedFieldSet;
    }

    static prepareSubmit(formValues: Record<string, any>): FormData | Record<string, any> {
        let hasFile = false;

        // Check if any value is a File or Blob
        for (const value of Object.values(formValues)) {
            if (value instanceof File || value instanceof Blob) {
                hasFile = true;
                break;
            }

            // Check for array of files (multiple upload)
            if (Array.isArray(value) && value.some(v => v instanceof File || v instanceof Blob)) {
                hasFile = true;
                break;
            }
        }

        if (hasFile) {
            // Build FormData
            const newFormData = new FormData();
            Object.entries(formValues).forEach(([key, value]) => {
                if (value !== undefined && value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach(v => newFormData.append(key, v));
                    } else {
                        newFormData.append(key, value);
                    }
                }
            });
            return newFormData;
        }

        // No files — return JSON object
        return formValues;
    }


}