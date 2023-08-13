require("dotenv").config();
import "../styles/swiper.css";
import "../styles/index.css";
import "../styles/globals.css";
import "../styles/globalTables.css";
import "../styles/Editor.css"
import "../styles/normal.css";
import SiteLayout from "../components/Layout/SiteLayout";
// import { disableReactDevTools } from "@fvilers/disable-react-devtools";

// if (process.env.NODE_ENV === "production") disableReactDevTools();

function MyApp({ Component, pageProps }) {
  const getLayout =
    Component.getLayout || ((page) => <SiteLayout children={page} />);

  return getLayout(<Component {...pageProps} />);
}

export default MyApp;
