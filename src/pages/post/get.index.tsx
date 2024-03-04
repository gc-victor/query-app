import "h/document";

import h from "h";

import svg from "@/pages/pages.svg";

import { POST_DATABASE } from "@/config/shared/post.constants";
import { PAGE_POST_PATH } from "@/config/shared/post.constants";
import { getStyle } from "@/lib/server/get-bundle-files";
import { hotReload } from "@/pages/hot-reload/hot-reload";
import { Layout } from "@/pages/layouts/layout";
import { Body, Head, Template } from "@/pages/layouts/template";
import { Excerpt } from "./excerpt";

export async function handleRequest(req: Request) {
    const url = new URL(req.url);

    const db = new Database(POST_DATABASE);
    const result = await db.query("SELECT * FROM post ORDER BY created_at DESC");
    const posts = result.map((post) => {
        const title = post.title;
        const content = post.content as string;
        const slug = post.slug as string;
        const image_url = result[0].image_url;
        const excerpt = content?.match(/<p>([\s\S]+?)<\/p>/)?.[1];

        const created_at = new Date((post.created_at as number) * 1000).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
        const datetime = new Date((post.created_at as number) * 1000).toISOString();

        return {
            created_at: created_at as string,
            datetime: datetime as string,
            image_url: image_url as string,
            title: title as string,
            slug: `${PAGE_POST_PATH}${slug}` as string,
            excerpt: excerpt as string,
        };
    });

    return new Response(
        <Template>
            <Head title="Query Blog">{await getStyle("dist/styles.css")}</Head>
            <Body class="overflow-y-scroll">
                <Layout>
                    <div class="flex flex-col space-y-8">
                        {posts.map((post) => (
                            <Excerpt {...post} />
                        ))}
                    </div>
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
}
