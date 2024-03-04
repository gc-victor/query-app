import h from "h";

import { API_ADMIN_TOKEN_PATH } from "@/config/shared/token.constants";
import { Button } from "@/pages/admin/components/button";
import { Input } from "@/pages/admin/components/input";
import { Legend } from "@/pages/admin/components/legend";
import { Switch } from "@/pages/admin/components/switch";
import { Textarea } from "@/pages/admin/components/textarea";
import { ID_FORM_COMPONENT } from "@/pages/admin/utils/constants";

export function TokenFormView() {
    return (
        <form is="form-element" id={ID_FORM_COMPONENT} class="h-full pt-6 w-full" method="dialog" path={API_ADMIN_TOKEN_PATH}>
            <div class="absolute right-4 text-3xl top-4">
                <Button variant="transparent" type="reset">
                    <span class="block px-3 py-1">
                        <span class="sr-only">Close</span>
                        <span aria-hidden="true">×</span>
                    </span>
                </Button>
            </div>
            <fieldset class="max-h-svh -mb-40 overflow-y-auto pb-40 px-6 space-y-6" tabindex="-1">
                <Legend>Token</Legend>
                <Switch id="active" label="Active" />
                <Input id="name" label="Name" aria-required="true" placeholder="Write a name here..." />
                <Input id="public_token" label="Public Token" aria-required="true" placeholder="Write a public_token here..." />
                <Input id="query_token" label="Query Token" aria-required="true" placeholder="Write a query_token here..." />
                <Textarea id="description" label="Description" aria-required="true" placeholder="Write a description here..." />
            </fieldset>
            <div class="absolute bg-white bottom-0 flex h-20 items-center justify-between px-6 w-full">
                <div class="flex">
                    <Button variant="w-md" type="reset">
                        Cancel
                    </Button>
                    <div class="ml-4">
                        <Button variant="md" type="submit">
                            Submit
                        </Button>
                    </div>
                </div>
                <Button color="red" variant="md" formmethod="delete" type="submit">
                    Delete
                </Button>
            </div>
        </form>
    );
}
