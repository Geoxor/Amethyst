/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from "url";
import path from "path";

export function resolveHTMLPath(htmlFileName: string) {
    if (process.env.NODE_ENV === "development") {
        const url = new URL(`http://localhost:${process.env.PORT || 1212}`);

		url.pathname = htmlFileName;

        return url.href;
    }
    else {
        return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`;
    }
}
