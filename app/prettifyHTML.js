export const prettifyHTML = (html) => {
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = html.trim();
  
    // Helper function to remove empty elements
    const removeEmptyTags = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (
          child.nodeType === Node.ELEMENT_NODE &&
          !child.textContent.trim() &&
          !child.childNodes.length // Check if the element is empty
        ) {
          child.remove(); // Remove the empty element
        } else if (child.nodeType === Node.ELEMENT_NODE) {
          removeEmptyTags(child); // Recursively check child nodes
        }
      });
    };
  
    // Helper function to add comments above the <title> tag
    const addTitleComment = (node) => {
      let titleElement = node.querySelectorAll("title");
        titleElement.forEach((title) => {
                const comment = document.createComment(` ============================================ -->
  <!--  ${title.textContent}  -->            
  <!-- ============================================ `);
                node.insertBefore(comment, title); // Add comment above the <title> tag
        })
     
    };
  
    // Remove empty tags and add title comment
    removeEmptyTags(tempDiv);
    addTitleComment(tempDiv);
  
    const prettify = (node, level = 0) => {
      const indent = "  ".repeat(level);
      let result = "";
  
      if (node.nodeType === Node.ELEMENT_NODE) {
        result += `${indent}<${node.tagName.toLowerCase()}`;
        for (const attr of node.attributes) {
          result += ` ${attr.name}="${attr.value}"`;
        }
        result += ">";
      } else if (node.nodeType === Node.TEXT_NODE && node.textContent.trim()) {
        result += `${indent}${node.textContent.trim()}`;
      } else if (node.nodeType === Node.COMMENT_NODE) {
        result += `${indent}<!--${node.data}-->`;
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
  