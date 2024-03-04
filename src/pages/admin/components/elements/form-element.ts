import { CLASS_FORM_ERROR_TEXT, ID_DRAWER_COMPONENT } from "@/pages/admin/utils/constants";

import { DrawerComponent } from "./drawer-element";

export interface FormComponent extends HTMLElement {
    uuid: string;
    path: string;
    setFormData(): Promise<void>;
}

class Form extends HTMLFormElement {
    connectedCallback() {
        document.getElementById(ID_DRAWER_COMPONENT)?.addEventListener("close", () => {
            this.uuid = "";
            this.reset();
        });

        this.addEventListener("reset", this.close);

        for (const button of Array.from(this.querySelectorAll('button[type="submit"]'))) {
            button.addEventListener("click", this.handleSubmit.bind(this));
        }
    }

    [key: string]: unknown;

    // from https://web.dev/custom-elements-best-practices/#make-properties-lazy
    upgradeProperty(prop: string): void {
        if (Object.prototype.hasOwnProperty.call(this, prop)) {
            const value: unknown = this[prop];
            delete this[prop];
            this[prop] = value;
        }
    }

    get uuid(): string {
        return this.getAttribute("uuid") as string;
    }

    set uuid(value: string) {
        if (value) {
            this.setAttribute("uuid", value);
        } else if (this.hasAttribute("uuid")) {
            this.removeAttribute("uuid");
        }
    }

    get path(): string {
        return this.getAttribute("path") as string;
    }

    set path(value: string) {
        if (value) {
            this.setAttribute("path", value);
        } else if (this.hasAttribute("path")) {
            this.removeAttribute("path");
        }
    }

    static get observedAttributes(): string[] {
        return ["uuid"];
    }

    async attributeChangedCallback(name: string, oldValue: unknown, newValue: unknown) {
        if (name === "uuid" && newValue) {
            await this.setFormData();
        }
    }

    async setFormData() {
        const res = await fetch(`${this.path}/uuid/${this.uuid}`, { method: "GET" });
        const json = await res.json();
        const jsonData = json.data[0];

        for (const fieldName of Object.keys(jsonData)) {
            const fieldValue = jsonData[fieldName];
            const formField = this.querySelectorAll(`[name="${fieldName}"]`) as NodeListOf<
                HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
            >;

            if (formField.length) {
                for (const el of Array.from(formField)) {
                    if (el.tagName === "INPUT" && el.type === "checkbox") {
                        (el as HTMLInputElement).checked = fieldValue;
                    } else {
                        el.value = fieldValue;
                    }
                }
            }
        }
    }

    async handleSubmit(e: Event) {
        e.preventDefault();

        if ((e.target as HTMLButtonElement)?.getAttribute("formmethod") === "delete") {
            this.delete(e);
        } else if (this.uuid) {
            this.update(e);
        } else {
            this.create(e);
        }
    }

    async delete(e: Event) {
        e.preventDefault();

        if (this.uuid) {
            await fetch(`${this.path}`, { method: "DELETE", body: JSON.stringify({ uuid: this.uuid }) });
        }

        this.close();
    }

    async create(e: Event) {
        e.preventDefault();

        const formData = new FormData(this);

        // NOTE: Workaround to send binary data as it fails in Query as it isn't a valid UTF-8 string
        await this.fileToData(formData);

        const res = await fetch(`${this.path}`, { method: "POST", body: formData });

        if (res.ok) {
            this.close();
        } else {
            if (res.status < 500) {
                const json = await res.json();

                this.setFieldErrors(json.errors);
            }
        }
    }

    async update(e: Event) {
        e.preventDefault();

        const formData = new FormData(this);

        // NOTE: Workaround to send binary data as it fails in Query as it isn't a valid UTF-8 string
        await this.fileToData(formData);

        formData.set("uuid", this.uuid);

        const res = await fetch(`${this.path}`, { method: "PUT", body: formData });

        if (res.ok) {
            this.close();
        } else {
            if (res.status < 500) {
                const json = await res.json();

                this.setFieldErrors(json.errors);
            }
        }
    }

    close() {
        const drawer = document.getElementById(ID_DRAWER_COMPONENT) as DrawerComponent;

        if (drawer) {
            drawer.open = false;

            for (const el of Array.from(this.querySelectorAll("input, textarea, select"))) {
                this.updateField(el as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, true, "");
            }
        }
    }

    setFieldErrors(errors: Record<string, string[]>) {
        for (const fieldName of Object.keys(errors)) {
            const fieldError = errors[fieldName][0];
            const formField = this.querySelector(`[name="${fieldName}"]`) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;

            if (fieldError) {
                this.updateField(formField, false, fieldError);
            } else {
                this.updateField(formField, true, "");
            }
        }
    }

    updateField(el: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, isValid: boolean, errorMessage: string) {
        const parentElement = el.parentElement as HTMLElement;
        const elError = parentElement?.querySelector(`.${CLASS_FORM_ERROR_TEXT}`) as HTMLElement;

        if (isValid) {
            el.removeAttribute("aria-invalid");
            el.setCustomValidity("");
            el.reportValidity();

            parentElement.classList.remove("text-red-500");

            if (elError) {
                elError.textContent = "";
            }

            el.removeEventListener("input", this.clearValidation.bind(this));
        } else {
            el.setAttribute("aria-invalid", "true");
            el.setCustomValidity(errorMessage);
            el.reportValidity();

            parentElement.classList.add("text-red-500");

            if (elError) {
                elError.setAttribute("aria-live", "assertive");
                elError.textContent = errorMessage;
            }

            el.addEventListener("input", this.clearValidation.bind(this));

            // NOTE: avoids the native tooltip
            (this.querySelector('button[type="submit"]') as HTMLButtonElement)?.focus();
        }
    }

    clearValidation(e: Event) {
        const event = e as KeyboardEvent;

        this.updateField(event.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, true, "");
    }

    // NOTE: Workaround to send binary data as it fails in Query as it isn't a valid UTF-8 string
    private async fileToData(formData: FormData) {
        const formDataEntries: { key: string; value: FormDataEntryValue }[] = [];

        formData.forEach((value, key) => formDataEntries.push({ key, value }));

        for (const { key, value } of formDataEntries) {
            if (value instanceof File) {
                const arrayBuffer = await value.arrayBuffer();
                const uint8Array = new Uint8Array(arrayBuffer);
                formData.set(key, new Blob([JSON.stringify(Array.from(uint8Array))], { type: value.type }), value.name);
            }
        }
    }
}

if (!customElements.get("form-element")) {
    customElements.define("form-element", Form, { extends: "form" });
}
