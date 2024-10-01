import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { blackA, mauve, violet } from "@radix-ui/colors";
const config: Config = {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        ...blackA,
        ...mauve,
        ...violet,
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
