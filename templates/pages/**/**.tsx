import h from "h";

export interface {{ tablePascalCase }}Type {
    uuid: string;
    {% for column in columns %}
    {{ column.columnName }}: {{ column.columnTypeMatchTS }},
    {% endfor %}
    datetime: string;
    created_at: string;
}

export function {{ tablePascalCase }}({ uuid, {% for column in columns %} {{ column.columnName }},{% endfor %} datetime, created_at }: {{ tablePascalCase }}Type) {
    return (
        <article>
            <p class="text-sm text-slate-500">
                Published on <time datetime={datetime}>{created_at}</time>
            </p>
            <p>uuid:{' '}
                <a class="underline" href={`/{{ tableLowerCase }}/${uuid}`}>
                    {uuid}
                </a>
            </p>
            {% for column in columns %}
            {% if column.columnTypeMatchTS == boolean %}
            <p>{{ column.columnName }}: { {{ column.columnName }} ? "on" : "off" }</p>
            {% endif %}{% if column.columnTypeMatchTS == number %}
            <p>{{ column.columnName }}: { String({{ column.columnName }}) }</p>
            {% endif %}{% if column.columnTypeMatchTS != boolean && column.columnTypeMatchTS != number %}
            <p>{{ column.columnName }}: { {{ column.columnName }} }</p>
            {% endif %}
            {% endfor %}
        </article>
    );
}
