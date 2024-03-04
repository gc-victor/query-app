import h, { Fragment } from "h";

import { PAGE_ADMIN_TOKEN_PATH } from "@/config/shared/token.constants";
import { Button } from "@/pages/admin/components/button";
import { Header } from "@/pages/admin/components/header";
import { ID_DRAWER_COMPONENT, ID_NEW_ITEM } from "@/pages/admin/utils/constants";
import { TokenFormView } from "./token.form.view";

export interface TokenViewProps {
    id: number;
    uuid: string;
    active: boolean;
    name: string;
    public_token: string;
    query_token: string;
    description: string;
    created_at: number;
    updated_at: number;
}

export function TokenView({ data }: { data: TokenViewProps[] }) {
    return (
        <>
            <Header>
                {/* NOTE: The click handler is managed by table-element */}
                <Button id={ID_NEW_ITEM}>New Token</Button>
            </Header>
            <main>
                <drawer-element id={ID_DRAWER_COMPONENT} class="hidden" right>
                    <TokenFormView />
                </drawer-element>
                <div data-hot-reload-scroll="table-wrapper" class="h-[calc(100lvh_-_65px)] relative overflow-x-auto overflow-y-auto">
                    <div class="fixed bg-slate-100 h-10 w-full -z-10" />
                    <table is="table-element" url={PAGE_ADMIN_TOKEN_PATH} class="text-left rtl:text-right w-max">
                        <thead class="font-cal h-10 text-xs uppercase">
                            <tr>
                                <th scope="col" class="bg-slate-100 px-4 py-3 text-center w-id z-10">
                                    id
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-id z-10">
                                    uuid
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-bool z-10">
                                    active
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-string z-10">
                                    name
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-uuid z-10">
                                    public_token
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-string z-10">
                                    query_token
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-text z-10">
                                    description
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 text-center w-timestamp z-10">
                                    created_at
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 text-center w-timestamp z-10">
                                    updated_at
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.length === 0 ? (
                                <tr>
                                    <td class="py-4 text-center" colspan="7">
                                        No Token Found
                                    </td>
                                </tr>
                            ) : (
                                data.map((token) => (
                                    <tr data-uuid={token.uuid} class="border-b border-slate-100 h-8 relative text-sm hover:bg-slate-50">
                                        <td class="px-4 text-center">
                                            {/*
                                                    @see:
                                                    https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html#Update02
                                                    https://adrianroselli.com/2020/02/block-links-cards-clickable-regions-etc.html#comment-246683
                                                */}
                                            <button
                                                class="
                                                    after:content-['']
                                                    after:block
                                                    after:absolute
                                                    after:inset-0

                                                    focus:after:outline
                                                    focus:after:outline-2
                                                    focus:after:outline-slate-950
                                                "
                                                type="button"
                                            >
                                                <span class="sr-only">Edit</span>
                                            </button>
                                            {String(token.id)}
                                        </td>
                                        <td class="px-4">
                                            <div class="w-uuid truncate">{token.uuid}</div>
                                        </td>
                                        <td class="px-4">
                                            <div class="w-bool">{token.active ? "on" : "off"}</div>
                                        </td>
                                        <td class="px-4">
                                            <div class="w-string truncate">{token.name}</div>
                                        </td>
                                        <td class="px-4">
                                            <div class="w-uuid truncate">{token.public_token}</div>
                                        </td>
                                        <td class="px-4">
                                            <div class="w-string truncate">{token.query_token}</div>
                                        </td>
                                        <td class="px-4">
                                            <div class="max-h-8 w-text truncate">{token.description}</div>
                                        </td>
                                        <td class="px-4 text-center">
                                            <div class="m-auto w-timestamp">
                                                <div>{date(token.created_at)}</div>
                                                <div class="text-slate-500 text-xs">{time(token.created_at)}</div>
                                            </div>
                                        </td>
                                        <td class="px-4 text-center">
                                            <div class="m-auto w-timestamp">
                                                <div>{date(token.updated_at)}</div>
                                                <div class="text-slate-500 text-xs">{time(token.updated_at)}</div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>
        </>
    );
}

function date(timestamp: number) {
    return new Date(timestamp * 1000).toLocaleDateString();
}

function time(timestamp: number) {
    const date = new Date(timestamp * 1000);
    const hours = String(date.getUTCHours()).padStart(2, "0");
    const minutes = String(date.getUTCMinutes()).padStart(2, "0");
    const seconds = String(date.getUTCSeconds()).padStart(2, "0");

    return `${hours}:${minutes}:${seconds} UTC`;
}
