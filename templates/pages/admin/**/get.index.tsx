import "h/document";

import h from "h";

import svg from "@/pages/admin/admin.svg";

import { {{ tableConstantCase }}_DATABASE } from "@/config/shared/{{ tableLowerCase }}.constants";
import { PAGE_ADMIN_LOGIN_PATH } from "@/config/shared/shared.constants";
import { hotReload } from "@/pages/hot-reload/hot-reload";
import { adminUserSession, getAdminUserSession } from "@/lib/server/admin-user-session";
import { getScript, getStyle } from "@/lib/server/get-bundle-files";
import { Body, Head, Template } from "@/pages/admin/layouts/template";
import { {{ tablePascalCase }}View, type {{ tablePascalCase }}ViewProps } from "./{{ tableLowerCase }}.view";

export async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);

    try {
        const session = await getAdminUserSession(req);

        if (!session) {
            return Response.redirect(url.origin + PAGE_ADMIN_LOGIN_PATH);
        }

        const isExpired = await adminUserSession.isExpired(session);

        if (isExpired) {
            await adminUserSession.refresh(session);
        }
    } catch {
        return Response.redirect(url.origin + PAGE_ADMIN_LOGIN_PATH);
    }

    const db = new Database({{ tableConstantCase }}_DATABASE);
    const result = await db.query("SELECT * FROM  {{ tableSnakeCase }} ORDER BY created_at DESC");

    return new Response(
        <Template>
            <Head>
                <title>Query Admin {{ tableCapitalCase }}</title>
                {await getStyle("dist/styles.css")}
            </Head>
            <Body class="overflow-y-scroll">
                <{{tablePascalCase }}View data={result as unknown as {{tablePascalCase }}ViewProps[]} />
                {svg}
                {await getScript("dist/admin/{{ tableLowerCase }}/island/{{ tableLowerCase }}.island.js")}
                {hotReload(url.href)}
            </Body>
        </Template>,
        {
            headers: {
                "Content-Type": "text/html; charset=utf-8",
            },
        },
    );
}
