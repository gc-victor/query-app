/// <reference lib="dom" />

declare global {
    // NOTE: To avoid editor ts error
    namespace JSX {
        interface IntrinsicElements {
            [elemName: string]: unknown;
        }
    }

    interface Window {
        SideDrawer: NodeElement;
    }

    const process: {
        env: {
            [key: string]: string | undefined;
        };
    };

    class Database {
        constructor(path: string);
        query(sql: string, params?: unknown[] | Record<string, unknown>): Promise<Record<string, unknown>[]>;
        execute(sql: string, params?: unknown[] | Record<string, unknown>): Promise<Record<string, unknown>[]>;
    }

    // biome-ignore lint/style/noVar: <explanation>
    var argon2: {
        hash: (password: string) => Promise<string>;
        verify: (password: string, hash: string) => Promise<boolean>;
    };

    declare module 'h/document';

    // biome-ignore lint/style/noVar: <explanation>
    var span

    declare module "*.html" {
        const content: string;
        export default content;
    }

    declare module "*.svg" {
        const content: string;
        export default content;
    }
}

export { };
