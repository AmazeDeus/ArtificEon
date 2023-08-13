import { Provider } from "react-redux";
import { store } from "../../store";

// The default layout for the app housing the store. Unless any other layout is specified in the pages, this is the only one used 

const SiteLayout = ({ children }) => (
  <Provider store={store}>{children}</Provider>
);

export const getLayout = (page) => <SiteLayout>{page}</SiteLayout>;

export default SiteLayout;
