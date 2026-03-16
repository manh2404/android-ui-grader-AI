import type { Config } from "tailwindcss"

const config: Config = {
    darkMode: "class",
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#ec5b13",
                "background-light": "#f8f6f6",
                "background-dark": "#221610",
            },
            fontFamily: {
                display: ["Public Sans", "sans-serif"],
            },
        },
    },
}

export default config