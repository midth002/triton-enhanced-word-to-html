export const prettifyHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html.trim();

  // Helper to wrap <h4> and related <p> tags in the desired accordion template
  const wrapAccordions = (node) => {
    const elements = Array.from(node.children); // Get all child elements
    let currentAccordion = null; // Tracks the current accordion element

    elements.forEach((el) => {
      if (el.tagName === "H4") {
        // Close the current accordion if it exists
        if (currentAccordion) {
          node.appendChild(currentAccordion);
          currentAccordion = null;
        }

        // Start a new accordion
        currentAccordion = document.createElement("div");
        currentAccordion.setAttribute("data-accordion", "");

        const controlDiv = document.createElement("div");
        controlDiv.setAttribute("data-control", "");
        controlDiv.innerHTML = `<img data-src="/portals/0/angles-right-white-solid.svg" alt="Angles Right Icon" width="17" height="18" class="lazyload"/> ${el.textContent.trim()}`;

        currentAccordion.appendChild(controlDiv);
      } else if (el.tagName === "P") {
        // Add <p> tags to the current accordion's data-content
        if (currentAccordion) {
          let contentDiv = currentAccordion.querySelector('[data-content]');
          if (!contentDiv) {
            contentDiv = document.createElement("div");
            contentDiv.setAttribute("data-content", "");
            currentAccordion.appendChild(contentDiv);
          }
          contentDiv.appendChild(el);
        }
      } else if (el.tagName.startsWith("H") && el.tagName !== "H4") {
        // Close the current accordion and append a non-H4 heading
        if (currentAccordion) {
          node.appendChild(currentAccordion);
          currentAccordion = null;
        }
        node.appendChild(el);
      } else {
        // Add other elements outside of any accordion
        if (currentAccordion) {
          node.appendChild(currentAccordion);
          currentAccordion = null;
        }
        node.appendChild(el);
      }
    });

    // Append the last accordion if it exists
    if (currentAccordion) {
      node.appendChild(currentAccordion);
    }
  };

  // Helper to group data-accordion elements in a data-accordion-group wrapper
  const groupAccordions = (node) => {
    const children = Array.from(node.children);
    let groupContainer = null;

    children.forEach((el) => {
      if (el.getAttribute && el.getAttribute("data-accordion") !== null) {
        // console.log(el);
        // Start a new group container if it doesn't exist
        if (!groupContainer) {
          groupContainer = document.createElement("div");
          groupContainer.setAttribute("data-accordion-group", "");
          node.insertBefore(groupContainer, el);
        }
        groupContainer.appendChild(el); // Move accordion into group
      } else {
        // Close the group container if a non-accordion element is found
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
  
  // const addLabelComment = (node) => {
  //   const labelElements = node.querySelectorAll("label");
  //   labelElements.forEach((label) => {
  //     const structuredComment = ` ${label.textContent.trim()} `;
  //     const comment = document.createComment(structuredComment);
  //     try {
  //       if (node.contains(label)) {
  //         node.insertBefore(comment, label);
  //       } else {
  //         console.warn("Label element is not a direct child of the parent node.");
  //       }
  //     } catch (error) {
  //       console.error("Error inserting Comment to Text:", error);
  //     }
  //   });
  // };
  

  // Apply accordion wrapping before prettification
  wrapAccordions(tempDiv);
  groupAccordions(tempDiv); // Group data-accordion elements into data-accordion-group
  removeEmptyTags(tempDiv);
  addTitleComment(tempDiv);
  // addLabelComment(tempDiv);

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
