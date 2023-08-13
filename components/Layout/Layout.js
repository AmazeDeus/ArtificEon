import Header from "../Blog/Header/Header";

function Layout(props) {
  return (
    <>
      <Header />
      {props.children}
    </>
  );
}

export default Layout;
