export const prettifyHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html.trim();

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
        validateTabindex(child); // Validate tabindex
        removeEmptyTags(child);
      }
    });
  };

  const addTitleComment = (node) => {
    const titleElements = node.querySelectorAll("title");
    titleElements.forEach((title) => {
      const structuredComment = `
============================================
  ${title.textContent.trim()}                    
============================================`;
      const comment = document.createComment(structuredComment);
      try {
        node.insertBefore(comment, title);
      } catch (error) {
        console.error("Error inserting comment:", error);
      }
    });
  };

  removeEmptyTags(tempDiv);
  addTitleComment(tempDiv);

  const prettify = (node, level = 0) => {
    const indent = "  ".repeat(level);
    let result = "";

    if (node.nodeType === Node.ELEMENT_NODE) {
      validateTabindex(node); // Validate tabindex here as well
      result += `${indent}<${node.tagName.toLowerCase()}`;
      for (const attr of node.attributes) {
        result += ` ${attr.name}="${attr.value}"`;
      }
      result += ">";
    } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
      result += `${indent}${node.textContent.trim()}`;
    } else if (node.nodeType === Node.COMMENT_NODE) {
      result += `${indent}<!--${node.data.trim()}-->`;
    }

    if (node.childNodes.length) {
      for (const child of node.childNodes) {
        result += `\n${prettify(child, level + 1)}`;
      }
      if (node.nodeType === Node.ELEMENT_NODE) {
        result += `\n${indent}</${node.tagName.toLowerCase()}>`;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      result += `</${node.tagName.toLowerCase()}>`;
    }

    return result;
  };

  return prettify(tempDiv).trim();
};
