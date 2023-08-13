// Takes a optional wrapperTags and classes prop which affects the children of this component
// See "components/Blog/Article" and "components/Blog/OldPost" for implementation...

import { createElement } from "react";

function DynamicWrapper({ children, wrapperTags, classes, onClick }) {

  if (!wrapperTags) {
    return children;
  }

  // spread operator (...) to conditionally include properties in the returned object.
  // classes prop = truthy => { className: classes } object will be spread into the returned object => adding a className property with the value of the classes prop.
  // onClick prop = truthy => { onClick: onClick } object will be spread into the returned object => adding an onClick property with the value of the onClick prop.
  const getOptions = () => {
    return {
      ...(classes && { className: classes }),
      ...(onClick && { onClick: onClick }),
    };
  };

  // Split the wrapperTags string into an array of tag names using the split method with a space as the delimiter.
  // use this array in the reduce method, where iterating over the tags array and create a new React element for each tag.
  // pass the acc value (previous React element) as the child to the new element.
  return wrapperTags.split(" ").reduce((acc, tag) => {
    return createElement(tag, getOptions(), acc);
  }, children);
}

export default DynamicWrapper;

/* Props usage:
// Example of wrapperTags props usage: wrapperTags={["ul", "li", "span"]}
// -> outer most wrapper tag of children would be a <ul>, followed by <li> and the <span>.
// classes prop gets passed to the outermost wrapper tag only.
// Example of classes props usage: classes={classes.someClass} // Passing that "someClass" css class from that parent file.
*/