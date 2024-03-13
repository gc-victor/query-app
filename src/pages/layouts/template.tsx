import h from "h";

export const Template = ({ children }: { children?: unknown }) => {
    return `<!DOCTYPE html>${(
        <html lang="en">
            {children}
        </html>
    )}`;
};

export function Head({ title = "Query", children }: { title: string; children?: unknown }) {
    return (
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="Content-Type" content="text/html" />
            <title>{title}</title>
            {children}
        </head>
    );
}

export function Body({ children, ...props }: { children?: unknown; [key: string]: unknown | unknown[] }) {
    return <body {...props}>{children}</body>;
}
