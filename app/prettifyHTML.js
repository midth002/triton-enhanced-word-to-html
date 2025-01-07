export const prettifyHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html.trim();
  
  const wrapAccordions = (node) => {
  const elements = Array.from(node.children);
  let currentAccordion = null;
  
  elements.forEach((el) => {
  if (el.tagName === "H4") {
  if (currentAccordion) {
  node.appendChild(currentAccordion);
  currentAccordion = null;
  }
  
  currentAccordion = document.createElement("div");
  currentAccordion.setAttribute("data-accordion", "");
  
  const controlDiv = document.createElement("div");
  controlDiv.setAttribute("data-control", "");
  controlDiv.innerHTML = `<img data-src="/portals/0/angles-right-white-solid.svg" alt="Angles Right Icon" width="17" height="18" class="lazyload"/> ${el.textContent.trim()}`;
  
  currentAccordion.appendChild(controlDiv);
  } else if (el.tagName === "P") {
  if (currentAccordion) {
  let contentDiv = currentAccordion.querySelector('[data-content]');
  if (!contentDiv) {
  contentDiv = document.createElement("div");
  contentDiv.setAttribute("data-content", "");
  currentAccordion.appendChild(contentDiv);
  }
  contentDiv.appendChild(el);
  } else {
  node.appendChild(el);
  }
  } else if (el.tagName.startsWith("H") && el.tagName !== "H4") {
  if (currentAccordion) {
  node.appendChild(currentAccordion);
  currentAccordion = null;
  }
  node.appendChild(el);
  } else {
  if (currentAccordion) {
  node.appendChild(currentAccordion);
  currentAccordion = null;
  }
  node.appendChild(el);
  }
  });
  
  if (currentAccordion) {
  node.appendChild(currentAccordion);
  }
  };
  
  const groupAccordions = (node) => {
  const children = Array.from(node.children);
  let groupContainer = null;
  
  children.forEach((el) => {
  if (el.getAttribute && el.getAttribute("data-accordion") !== null) {
  if (!groupContainer) {
  groupContainer = document.createElement("div");
  groupContainer.setAttribute("data-accordion-group", "");
  node.insertBefore(groupContainer, el);
  }
  groupContainer.appendChild(el);
  } else {
  if (groupContainer) {
  groupContainer = null;
  }
  }
  });
  };
  
  const validateTabindex = (node) => {
  const focusableElements = ["a", "button", "input", "textarea", "select"];
  if (node.hasAttribute("tabindex") && !focusableElements.includes(node.tagName.toLowerCase())) {
  console.warn(`Invalid tabindex attribute on <${node.tagName.toLowerCase()}>. Removing.`);
  node.removeAttribute("tabindex");
  }
  };
  
  const removeEmptyTags = (node) => {
  Array.from(node.childNodes).forEach((child) => {
  if (
  child.nodeType === Node.ELEMENT_NODE &&
  !child.textContent.trim() &&
  !child.childNodes.length
  ) {
  child.remove();
  } else if (child.nodeType === Node.ELEMENT_NODE) {
  validateTabindex(child);
  removeEmptyTags(child);
  }
  });
  };
  
  const addTitleComment = (node) => {
  const titleElements = node.querySelectorAll("title");
  titleElements.forEach((title) => {
  const structuredComment = `
  ============================================
  PAGE: ${title.textContent.trim()}
  ============================================`;
  const comment = document.createComment(structuredComment);
  try {
  if (node.contains(title)) {
  node.insertBefore(comment, title);
  } else {
  console.warn("Title element is not a direct child of the parent node.");
  }
  } catch (error) {
  console.error("Error inserting comment:", error);
  }
  });
  };
  
  const addLabelComment = (node) => {
  const labelElements = node.querySelectorAll("label");
  labelElements.forEach((label) => {
  const structuredComment = ` ${label.textContent.trim()} `;
  const comment = document.createComment(structuredComment);
  
  try {
  if (label.parentNode) {
  label.parentNode.insertBefore(comment, label);
  label.remove();
  }
  } catch (error) {
  console.error("Error inserting Comment to Text:", error);
  }
  });
  };
  
  removeEmptyTags(tempDiv);
  wrapAccordions(tempDiv);
  groupAccordions(tempDiv);
  addTitleComment(tempDiv);
  addLabelComment(tempDiv);
  
  const prettify = (node, level = 0) => {
    // FOR INDENTING
  // const indent = "  ".repeat(level);
  let result = "";
  
  if (node.nodeType === Node.ELEMENT_NODE) {
  validateTabindex(node);
  result += `<${node.tagName.toLowerCase()}`;
  for (const attr of node.attributes) {
  result += ` ${attr.name}="${attr.value}"`;
  }
  result += ">";
  } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
  result += `${node.textContent.trim()}`;
  } else if (node.nodeType === Node.COMMENT_NODE) {
  result += `<!--${node.data.trim()}-->`;
  }
  
  if (node.childNodes.length) {
  for (const child of node.childNodes) {
    // FOR INDENTING
  // result += `\n${prettify(child, level + 1)}`;
  result += prettify(child);
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    // result += `\n</${node.tagName.toLowerCase()}>`;
  result += `</${node.tagName.toLowerCase()}>`;
  }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
  result += `</${node.tagName.toLowerCase()}>`;
  }
  
  // return result;
  return result.replace(/>\s+</g, "><");
  };
  
  return prettify(tempDiv).trim();
  };
  