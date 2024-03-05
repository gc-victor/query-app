import "h/document";

import h from "h";

import svg from "@/pages/pages.svg";

import { {{ tableConstantCase }}_DATABASE } from "@/config/shared/{{ tableLowerCase }}.constants";
import { hotReload } from "@/pages/hot-reload/hot-reload";
import { getStyle } from "@/lib/server/get-bundle-files";
import { Layout } from "@/pages/layouts/layout";
import { Body, Head, Template } from "@/pages/layouts/template";
import { {{ tablePascalCase }} } from "@/pages/{{ tableLowerCase }}/{{ tableLowerCase }}";

export async function handleRequest(req: Request) {
    const url = new URL(req.url);

    const db = new Database({{ tableConstantCase }}_DATABASE);
    const result = await db.query("SELECT * FROM  {{ tableSnakeCase }} ORDER BY created_at DESC");
    const {{ tableCamelCase }}List = result.map(({{ tableCamelCase }}) => {
        {% for column in columns %}
        const {{ column.columnNameCamelCase }} = {{ tableCamelCase }}.{{ column.columnName }} as {{ column.columnTypeMatchTS }};
        {% endfor %}

        const created_at = new Date(({{ tableCamelCase }}.created_at as number) * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const datetime = new Date(({{ tableCamelCase }}.created_at as number) * 1000).toISOString();

        return {
            uuid: {{ tableCamelCase }}.uuid as string,
            {% for column in columns %}
            {{ column.columnNameCamelCase }},
            {% endfor %}
            created_at: created_at as string,
            datetime: datetime as string,
        };
    });

    return new Response((
            <Template>
                <Head title="Query {{ tableCapitalCase }} List">{await getStyle("dist/styles.css")}</Head>
                <Body class="overflow-y-scroll">
                    <Layout>
                        <h1 class="font-cal text-2xl">{{ tableCapitalCase }} Items</h1>
                        <div class="flex flex-col space-y-8">
                            { {{ tableCamelCase }}List.map(({{ tableCamelCase }}) => (
                                <{{ tablePascalCase }} uuid={ {{ tableCamelCase }}.uuid } {% for column in columns %} {{ column.columnName }}={ {{ tableCamelCase }}.{{ column.columnNameCamelCase }} }{% endfor %} created_at={ {{ tableCamelCase }}.created_at } datetime={ {{ tableCamelCase }}.datetime } />
                            )) }
                        </div>
                    </Layout>
                    {svg}
                    {hotReload(url.href)}
                </Body>
            </Template>
        ), {
        headers: {
            "Content-Type": "text/html; charset=utf-8",
        },
    });
}
