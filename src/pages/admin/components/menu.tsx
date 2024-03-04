import h from "h";

import { PAGE_ADMIN_POST_PATH } from "@/config/shared/post.constants";
import { PAGE_ADMIN_TOKEN_PATH } from "@/config/shared/token.constants";

export function Menu() {
    return (
        <menu className="flex items-center text-sm">
            <li className="mx-2">
                <a class="hover:underline" href={PAGE_ADMIN_POST_PATH}>
                    Post
                </a>
            </li>
            <li className="mx-2">
                <a class="hover:underline" href={PAGE_ADMIN_TOKEN_PATH}>
                    Token
                </a>
            </li>
        </menu>
    );
}
