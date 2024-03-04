import { PAGE_ADMIN_POST_PATH } from "@/config/shared/post.constants";
import { ID_DRAWER_COMPONENT, ID_FORM_COMPONENT, ID_NEW_ITEM } from "@/pages/admin/utils/constants";

import { DrawerComponent } from "./drawer-element";
import { FormComponent } from "./form-element";

export interface TableComponent extends HTMLElement {
    url: string;
}

class Table extends HTMLTableElement {
    connectedCallback() {
        this.addEventListener("click", this.handleClick);

        document.getElementById(ID_DRAWER_COMPONENT)?.addEventListener("close", async () => {
            const response = await fetch(this.url);
            const html = await response.text();
            const template = document.createElement("template");
            template.innerHTML = html;
            const doc = template.content.cloneNode(true) as Document;
            const docTBody = doc.querySelector("tbody");

            if (docTBody) {
                const tbody = this.querySelector("tbody");

                tbody?.parentNode?.replaceChild(docTBody, tbody);
            }
        });

        document.getElementById(ID_NEW_ITEM)?.addEventListener("click", async () => {
            (document.getElementById(ID_DRAWER_COMPONENT) as DrawerComponent).open = true;
        });
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

    get url(): string {
        return this.getAttribute("url") as string;
    }

    set url(value: string) {
        if (value) {
            this.setAttribute("url", value);
        } else if (this.hasAttribute("url")) {
            this.removeAttribute("url");
        }
    }

    handleClick(event: Event) {
        const target = event.target;

        if (target instanceof HTMLAnchorElement) {
            return;
        }

        event.preventDefault();

        const el = (target as HTMLElement).closest("tr");
        const uuid = el?.getAttribute("data-uuid");
        const drawer = document.getElementById(ID_DRAWER_COMPONENT) as DrawerComponent | null;
        const form = document.getElementById(ID_FORM_COMPONENT) as FormComponent;

        if (uuid && drawer && form) {
            form.uuid = uuid;
            drawer.open = true;
        }
    }
}

if (!customElements.get("table-element")) {
    customElements.define("table-element", Table, {
        extends: "table",
    });
}
