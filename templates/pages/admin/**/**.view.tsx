import h, { Fragment } from "h";

import { PAGE_ADMIN_{{ tableConstantCase }}_PATH } from "@/config/shared/{{ tableLowerCase }}.constants";
import { Button } from "@/pages/admin/components/button";
import { Header } from "@/pages/admin/components/header";
import { ID_DRAWER_COMPONENT, ID_NEW_ITEM } from "@/pages/admin/utils/constants";
import { {{ tablePascalCase }}FormView } from "./{{ tableLowerCase }}.form.view";

export interface {{ tablePascalCase }}ViewProps {
    id: number;
    uuid: string;
    {% for column in columns %}
    {{ column.columnName }}: {{ column.columnTypeMatchTS }},
    {% endfor %}
    created_at: number;
    updated_at: number;
}

export function {{ tablePascalCase }}View({ data }: { data: {{ tablePascalCase }}ViewProps[] }) {
    return (
        <>
            <Header>
                {/* NOTE: The click handler is managed by table-element */}
                <Button id={ID_NEW_ITEM}>New {{ tableCapitalCase }}</Button>
            </Header>
            <main>
                <drawer-element id={ID_DRAWER_COMPONENT} class="hidden" right>
                    <{{ tablePascalCase }}FormView />
                </drawer-element>
                <div data-hot-reload-scroll="table-wrapper" class="h-[calc(100lvh_-_65px)] relative overflow-x-auto overflow-y-auto">
                    <div class="fixed bg-slate-100 h-10 w-full -z-10" />
                    <table is="table-element" url={PAGE_ADMIN_{{ tableConstantCase }}_PATH} class="text-left rtl:text-right w-max">
                        <thead class="font-cal h-10 text-xs uppercase">
                            <tr>
                                <th scope="col" class="bg-slate-100 px-4 py-3 text-center w-id z-10">
                                    <span className="sr-only">Visit</span>
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 text-center w-id z-10">
                                    id
                                </th>
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-id z-10">
                                    uuid
                                </th>
                                {% for column in columns %}
                                {% if column.columnTypeMatchTS == number %}
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-number z-10">
                                    {{ column.columnNameSnakeCase }}
                                </th>
                                {% endif %}{% if column.columnTypeMatchTS == boolean %}
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-bool z-10">
                                    {{ column.columnNameSnakeCase }}
                                </th>
                                {% endif %}{% if column.columnType == uuid %}
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-uuid z-10">
                                    {{ column.columnNameSnakeCase }}
                                </th>
                                {% endif %}{% if column.columnType == string %}
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-string z-10">
                                    {{ column.columnNameSnakeCase }}
                                </th>
                                {% endif %}{% if column.columnType == text %}
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-text z-10">
                                    {{ column.columnNameSnakeCase }}
                                </th>
                                {% endif %}{% if column.columnType == timestamp %}
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-timestamp z-10">
                                    {{ column.columnNameSnakeCase }}
                                </th>
                                {% endif %}{% if column.columnType == date %}
                                <th scope="col" class="bg-slate-100 px-4 py-3 w-timestamp z-10">
                                    {{ column.columnNameSnakeCase }}
                                </th>
                                {% endif %}
                                {% endfor %}
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
                                    <td>{}</td>
                                    <td>{}</td>
                                    <td>{}</td>
                                    <td class="py-4 text-center" colspan="{{ columnsLength }}">
                                        No {{ tableCapitalCase }} Found
                                    </td>
                                    <td>{}</td>
                                    <td>{}</td>
                                </tr>
                            ) : (
                                data.map(({{ tableCamelCase }}) => (
                                    <tr data-uuid={ {{ tableCamelCase }}.uuid } class="border-b border-slate-100 h-8 relative text-sm hover:bg-slate-50">
                                        <td class="px-4 text-center">
                                            <span className="relative z-10">
                                                <Button tag="a" href={`/{{ tableLowerCase }}/${ {{ tableCamelCase }}.uuid }`}>Visit</Button>
                                            </span>
                                        </td>
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
                                            {String({{ tableCamelCase }}.id)}
                                        </td>
                                        <td class="px-4">
                                            <div class="w-uuid truncate">{ {{ tableCamelCase }}.uuid }</div>
                                        </td>
                                        {% for column in columns %}
                                        {% if column.columnTypeMatchTS == number %}
                                        <td class="px-4">
                                            <div class="w-number">{ String({{ tableCamelCase }}.{{ column.columnName }}) }</div>
                                        </td>
                                        {% endif %}{% if column.columnTypeMatchTS == boolean %}
                                        <td class="px-4">
                                            <div class="w-bool">{ {{ tableCamelCase }}.{{ column.columnName }} ? "on" : "off" }</div>
                                        </td>
                                        {% endif %}{% if column.columnType == uuid %}
                                        <td class="px-4">
                                            <div class="w-uuid truncate">{ {{ tableCamelCase }}.{{ column.columnName }} }</div>
                                        </td>
                                        {% endif %}{% if column.columnType == string %}
                                        <td class="px-4">
                                            <div class="w-string truncate">{ {{ tableCamelCase }}.{{ column.columnName }} }</div>
                                        </td>
                                        {% endif %}{% if column.columnType == text %}
                                        <td class="px-4">
                                            <div class="max-h-8 w-text truncate">{ {{ tableCamelCase }}.{{ column.columnName }} }</div>
                                        </td>
                                        {% endif %}{% if column.columnType == timestamp %}
                                        <td class="px-4">
                                            <div class="w-number">{ {{ tableCamelCase }}.{{ column.columnName }} }</div>
                                        </td>
                                        {% endif %}{% if column.columnType == date %}
                                        <td class="px-4 text-center">
                                            <div class="m-auto w-timestamp">
                                                <div>{date({{ tableCamelCase }}.{{ column.columnName }})}</div>
                                                <div class="text-slate-500 text-xs">{time({{ tableCamelCase }}.{{ column.columnName }})}</div>
                                            </div>
                                        </td>
                                        <td class="px-4 text-center">
                                            <div class="m-auto w-timestamp">
                                                <div>{date({{ tableCamelCase }}.{{ column.columnName }})}</div>
                                                <div class="text-slate-500 text-xs">{time({{ tableCamelCase }}.{{ column.columnName }})}</div>
                                            </div>
                                        </td>
                                        {% endif %}
                                        {% endfor %}
                                        <td class="px-4 text-center">
                                            <div class="m-auto w-timestamp">
                                                <div>{date({{ tableCamelCase }}.created_at)}</div>
                                                <div class="text-slate-500 text-xs">{time({{ tableCamelCase }}.created_at)}</div>
                                            </div>
                                        </td>
                                        <td class="px-4 text-center">
                                            <div class="m-auto w-timestamp">
                                                <div>{date({{ tableCamelCase }}.updated_at)}</div>
                                                <div class="text-slate-500 text-xs">{time({{ tableCamelCase }}.updated_at)}</div>
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
