import h from "h";

export function Legend({ children = "", ...props }: { [key: string]: string | undefined }) {
    return (
        <legend class="font-cal text-2xl text-slate-950" {...props}>
            {children}
        </legend>
    );
}
