export const indentPrettifyHTML = (html) => {
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
        // Add <p> tags to the current accordion's data-content or leave them alone if no accordion exists
        if (currentAccordion) {
          let contentDiv = currentAccordion.querySelector('[data-content]');
          if (!contentDiv) {
            contentDiv = document.createElement("div");
            contentDiv.setAttribute("data-content", "");
            currentAccordion.appendChild(contentDiv);
          }
          contentDiv.appendChild(el);
        } else {
          // If no accordion exists, append the <p> directly to the node
          node.appendChild(el);
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
          // console.log(label.parentNode);
          label.parentNode.insertBefore(comment, label);
          label.remove(); // Remove the <label> after adding the comment
        }
      } catch (error) {
        console.error("Error inserting Comment to Text:", error);
      }
    });
  };
  
    // Ensure spaces around <a> tags and remove space before punctuation
    const adjustATagSpacing = (node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        // Add space around <a> and remove space before punctuation
        node.textContent = node.textContent
          .replace(/(?!^)(\S)<a/g, " $1 <a") // Add space before <a>
          .replace(/<\/a>(\S)/g, "</a> $1") // Add space after </a>
          .replace(/<\/a>\s+([.,;])/g, "</a>$1"); // Remove space before punctuation
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Recursively process child nodes
        for (const child of node.childNodes) {
          adjustATagSpacing(child);
        }
      }
    };
  

  
  removeEmptyTags(tempDiv);
  wrapAccordions(tempDiv);
  groupAccordions(tempDiv);
  addTitleComment(tempDiv);
  addLabelComment(tempDiv);
  adjustATagSpacing(tempDiv);

  const prettify = (node, level = 0) => {
    // FOR INDENTING
  const indent = " ".repeat(level);
  let result = "";
  
  if (node.nodeType === Node.ELEMENT_NODE) {
  validateTabindex(node);
  result += `${indent}<${node.tagName.toLowerCase()}`;
  for (const attr of node.attributes) {
  result += ` ${attr.name}="${attr.value}"`;
  }
  result += ">";
  } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {

    let text = node.textContent;
    text = text.replace(/<\/a>\s+([.,;])/g, "</a>$1"); // Remove space before punctuation after </a>
    
  result += text;
  } else if (node.nodeType === Node.COMMENT_NODE) {
  result += `<!--${node.data.trim()}-->`;
  }
  
  if (node.childNodes.length) {
  for (const child of node.childNodes) {
    // FOR INDENTING
  result += `${prettify(child, level + 1)}`;
  // result += prettify(child);
  }
  if (node.nodeType === Node.ELEMENT_NODE) {
    // result += `\n</${node.tagName.toLowerCase()}>`;
  result += `</${node.tagName.toLowerCase()}>`;
  }
  } else if (node.nodeType === Node.ELEMENT_NODE) {
  result += `</${node.tagName.toLowerCase()}>`;
  }
  
  return result
  .replace(/<\/a>\s+([.,;])/g, "</a>$1") // Remove spaces before punctuation
  .replace(/\s+<\/(\w+)>/g, "</$1>")
  .replace(/>\s+</g, "><")
  };
  
  return prettify(tempDiv).trim();
  };
