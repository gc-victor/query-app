import { parse } from "valibot";

import { QUERY_API_QUERY } from "@/config/server/server.constants";
import { TOKEN_DATABASE } from "@/config/shared/token.constants";
import { adminUserSession, getAdminUserSession } from "@/lib/server/admin-user-session";
import { fetcher } from "@/lib/server/fetcher";
import { handleRequestError } from "@/lib/server/handle-request-error";
import { AUTHORIZATION_REQUEST, CONTENT_TYPE_REQUEST } from "@/lib/server/header";
import { Method } from "@/lib/server/method";
import { ok } from "@/lib/server/responses";
import { TokenUpdateValidation } from "./token.validation";

export async function handleRequest(req: Request): Promise<Response> {
    try {
        const session = await getAdminUserSession(req);
        const isExpired = await adminUserSession.isExpired(session);

        if (isExpired) {
            await adminUserSession.refresh(session);
        }

        const { token } = await adminUserSession.load(session);

        const formData = await req.formData();
        const uuid = formData.get("uuid");
        const active = formData.get("active") === "on";
        const name = formData.get("name") as string;
        const publicToken = formData.get("public_token") as string;
        const queryToken = formData.get("query_token") as string;
        const description = formData.get("description") as string;

        parse(TokenUpdateValidation, { uuid, active: active, name: name, public_token: publicToken, query_token: queryToken, description: description });

        const query = "UPDATE token SET active = :active, name = :name, public_token = :public_token, query_token = :query_token, description = :description WHERE uuid = :uuid;";
        const params = {
            ":uuid": uuid,
            ":active": active,
            ":name": name,
            ":public_token": publicToken,
            ":query_token": queryToken,
            ":description": description,
        };

        const response = await fetcher(QUERY_API_QUERY, {
            method: Method.POST,
            body: JSON.stringify({ db_name: TOKEN_DATABASE, query, params }),
            headers: {
                [AUTHORIZATION_REQUEST]: `Bearer ${token}`,
                [CONTENT_TYPE_REQUEST]: "application/json",
            },
        });

        return ok(JSON.stringify(response.json));
    } catch (e) {
        return handleRequestError(e as Error);
    }
}
