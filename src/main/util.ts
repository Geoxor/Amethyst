import path from "path";
import { URL } from "url";

export function resolveHTMLPath(htmlFileName: string) {
    if (process.env.NODE_ENV === "development") {
        const url = new URL(`http://localhost:${1337}`);

		url.pathname = htmlFileName;

        return url.href;
    }
    else {
        return `file://${path.resolve(__dirname, "../renderer/", htmlFileName + ".html")}`;
    }
}
