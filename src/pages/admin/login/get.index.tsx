import "h/document";

import h from "h";

import svg from "@/pages/admin/admin.svg";

import { PAGE_ADMIN_POST_PATH } from "@/config/shared/post.constants";
import { adminUserSession, getAdminUserSession } from "@/lib/server/admin-user-session";
import { getScript, getStyle } from "@/lib/server/get-bundle-files";
import { hotReload } from "@/pages/hot-reload/hot-reload";
import { Body, Head, Template } from "@/pages/layouts/template";
import { LoginView } from "./login.view";

export async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);

    try {
        const session = await getAdminUserSession(req);

        if (session) {
            adminUserSession.refresh(session);

            return Response.redirect(url.origin + PAGE_ADMIN_POST_PATH);
        }
    } catch {}

    return new Response(
        <Template>
            <Head>
                <title>Query Admin Login</title>
                {await getStyle("dist/styles.css")}
            </Head>
            <Body class="bg-slate-950 text-white bg-gradient-to-b from-slate-900 to-slate-950 overflow-y-scroll">
                <LoginView />
                {svg}
                {await getScript("dist/admin/login/login.island.js")}
                {hotReload(url.href)}
            </Body>
        </Template>,
        {
            headers: {
                "Content-Type": "text/html;charset=utf-8",
            },
        },
    );
}
