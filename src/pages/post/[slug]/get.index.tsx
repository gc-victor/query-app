import "h/document";

import h from "h";

import svg from "@/pages/pages.svg";

import { POST_DATABASE } from "@/config/shared/post.constants";
import { HOME_PATH } from "@/config/shared/shared.constants";
import { getStyle } from "@/lib/server/get-bundle-files";
import { NOT_FOUND_CODE } from "@/lib/server/status";
import { hotReload } from "@/pages/hot-reload/hot-reload";
import { Html404 } from "@/pages/layouts/404";
import { Layout } from "@/pages/layouts/layout";
import { Body, Head, Template } from "@/pages/layouts/template";
import { Post } from "./post";

export async function handleRequest(req: Request) {
    const url = new URL(req.url);

    try {
        const db = new Database(POST_DATABASE);
        const result = await db.query("SELECT * FROM post WHERE slug = ?", [url.pathname.replace("/post/", "/")]);
        const title = result[0].title as string;
        const content = result[0].content as string;
        const image_url = result[0].image_url as string;
        const created_at = new Date((result[0].created_at as number) * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const datetime = new Date((result[0].created_at as number) * 1000).toISOString();

        return new Response(
            <Template>
                <Head title={title}>{await getStyle("dist/styles.css")}</Head>
                <Body class="overflow-y-scroll">
                    <Layout>
                        <Post created_at={created_at} datetime={datetime} image_url={image_url} title={title} content={content} />
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
                    {svg}
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
