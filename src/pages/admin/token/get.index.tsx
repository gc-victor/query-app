import "h/document";

import h from "h";

import svg from "@/pages/admin/admin.svg";

import { PAGE_ADMIN_LOGIN_PATH } from "@/config/shared/shared.constants";
import { TOKEN_DATABASE } from "@/config/shared/token.constants";
import { adminUserSession, getAdminUserSession } from "@/lib/server/admin-user-session";
import { getScript, getStyle } from "@/lib/server/get-bundle-files";
import { Body, Head, Template } from "@/pages/admin/layouts/template";
import { hotReload } from "@/pages/hot-reload/hot-reload";
import { TokenView, TokenViewProps } from "./token.view";

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

    const db = new Database(TOKEN_DATABASE);
    const result = await db.query("SELECT * FROM token ORDER BY created_at DESC");

    return new Response(
        <Template>
            <Head title="Query Admin token">{await getStyle("dist/styles.css")}</Head>
            <Body class="overflow-y-scroll">
                <TokenView data={result as unknown as TokenViewProps[]} />
                {svg}
                {await getScript("dist/admin/token/island/token.island.js")}
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
