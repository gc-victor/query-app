import { minLength, object, boolean, string, uuid } from "valibot";

export const TokenCreateValidation = object({
    active: boolean("Please enter a active."),
    name: string([minLength(1, "Please enter a name.")]),
    public_token: string([uuid()]),
    query_token: string([minLength(1, "Please enter a query_token.")]),
    description: string([minLength(1, "Please enter a description.")]),
});

export const TokenUpdateValidation = object({
    uuid: string([uuid()]),
    active: boolean("Please enter a active."),
    name: string([minLength(1, "Please enter a name.")]),
    public_token: string([uuid()]),
    query_token: string([minLength(1, "Please enter a query_token.")]),
    description: string([minLength(1, "Please enter a description.")]),
});

export const TokenDeleteValidation = object({
    uuid: string([uuid()])
});
