import "h/document";

import h from "h";

import svg from "@/pages/pages.svg";

import { {{ tableConstantCase }}_DATABASE } from "@/config/shared/{{ tableLowerCase }}.constants";
import { HOME_PATH } from "@/config/shared/shared.constants";
import { hotReload } from "@/pages/hot-reload/hot-reload";
import { getStyle } from "@/lib/server/get-bundle-files";
import { NOT_FOUND_CODE } from "@/lib/server/status";
import { Html404 } from "@/pages/layouts/404";
import { Layout } from "@/pages/layouts/layout";
import { Body, Head, Template } from "@/pages/layouts/template";
import { {{ tablePascalCase }} } from "@/pages/{{ tableLowerCase }}/{{ tableLowerCase }}";

export async function handleRequest(req: Request) {
    const url = new URL(req.url);

    try {
        const db = new Database({{ tableConstantCase }}_DATABASE);
        const result = await db.query("SELECT * FROM  {{ tableSnakeCase }} WHERE uuid = ?", [url.pathname.replace("/{{ tableLowerCase }}/", "")]);
        const uuid = result[0]?.uuid as string;
        {% for column in columns %}
        const {{ column.columnNameCamelCase }} = result[0]?.{{ column.columnName }} as {{ column.columnTypeMatchTS }};
        {% endfor %}
        const createdAt = new Date((result[0].created_at as number) * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const datetime = new Date((result[0].created_at as number) * 1000).toISOString();

        return new Response(
            <Template>
                <Head title="Query {{ tableCapitalCase }} Item">{await getStyle("dist/styles.css")}</Head>
                <Body class="overflow-y-scroll">
                    <Layout>
                        <article>
                            <h1 class="font-cal text-3xl">{{ tableCapitalCase }} Item</h1>
                            <p class="text-slate-500">
                                Published on <time datetime={datetime}>{createdAt}</time>
                            </p>
                            <{{ tablePascalCase }} {% for column in columns %} {{ column.columnNameCamelCase }}={{{ column.columnNameCamelCase }}}{% endfor %} createdAt={createdAt} datetime={datetime} />
                        </article>
                    </Layout>
                    {svg}
                    {hotReload(url.href)}
                </Body>
            </Template>,
            {
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                },
            },
        );
    } catch (error) {
        return new Response(
            <Template>
                <Head title="Page Not Found">{await getStyle("dist/styles.css")}</Head>
                <Body class="overflow-y-scroll">
                    <Layout>
                        <Html404 link={HOME_PATH} />
                    </Layout>
                    {hotReload(url.href)}
                </Body>
            </Template>,
            {
                status: NOT_FOUND_CODE,
                headers: {
                    "Content-Type": "text/html; charset=utf-8",
                },
            },
        );
    }
}
