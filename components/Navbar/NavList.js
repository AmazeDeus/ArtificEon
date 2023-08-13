import { useState } from "react";
import NavItem from "./NavItem";
import DynamicWrapper from "../ui/DynamicWrapper";

function NavList({ list, wrappers, classes, setNavActive }) {
  const [activeIdx, setActiveIdx] = useState(-1);

  let content;

  if (Array.isArray(list)) {
    content = list.map((item, idx) => {
      return (
        <DynamicWrapper
          onClick={() => {
            setActiveIdx(idx);
            // console.log(idx);
            setNavActive(false);
          }}
          key={item.text}
          wrapperTags={!wrappers ? null : wrappers}
          classes={!classes ? null : classes}
        >
          <NavItem active={activeIdx === idx} {...item} />
        </DynamicWrapper>
      );
    });
  } else if (list.text && list.href) {
    content = <NavItem {...list} />;
  }
  
  return content;
}

export default NavList;
