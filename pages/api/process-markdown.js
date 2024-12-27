import DOMPurify from "dompurify";

export const cleanHTML = (html) => {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  // Remove unnecessary span tags
  Array.from(tempDiv.querySelectorAll("span")).forEach((span) => {
    if (!span.attributes.length) {
      span.replaceWith(span.innerHTML);
    }
  });

  // Detect the first <h1> after a horizontal line and replace it with a comment
  let foundHr = false; // Track if an <hr> has been found
  Array.from(tempDiv.children).forEach((child) => {
    if (child.tagName === "HR") {
      foundHr = true; // Mark that we've encountered an <hr>
    } else if (foundHr && child.tagName === "H1") {
      // If it's the first <h1> after an <hr>
      const titleText = child.textContent.trim().toUpperCase(); // Extract title text
      const comment = `<!---------------- ${titleText} ----------------->`;
      const commentNode = document.createComment(comment); // Create an HTML comment node
      tempDiv.replaceChild(commentNode, child); // Replace the <h1> with the comment
      foundHr = false; // Reset the tracker to avoid converting subsequent <h1> tags
    }
  });

  // Remove <p> tags inside <li> elements
  Array.from(tempDiv.querySelectorAll("li")).forEach((li) => {
    Array.from(li.querySelectorAll("p")).forEach((p) => {
      p.replaceWith(...p.childNodes); // Replace <p> with its content
    });
  });

  // Convert <p> tags with square brackets to <a> tags
  Array.from(tempDiv.querySelectorAll("p")).forEach((p) => {
    const match = p.textContent.trim().match(/^\[(.+?)\]$/);
    console.log(match);
    if (match) {
      const text = match[1];
      const link = document.createElement("a");
      link.textContent = text;
      link.setAttribute("href", "/free-estimate");
      link.setAttribute("class", "button button--primary");
      p.replaceWith(link);
    }
  });

  // Add "uvp" class to <ul> tags following an <h1>
  Array.from(tempDiv.querySelectorAll("ul")).forEach((ul) => {
    const previousElement = ul.previousElementSibling;
    if (previousElement && previousElement.tagName === "H1") {
      ul.classList.add("uvp");
    }
  });

  // Sanitize the final HTML output using DOMPurify
  return DOMPurify.sanitize(tempDiv.innerHTML, {
    ALLOWED_TAGS: ["h1", "h2", "h3", "h4", "h5", "h6", "p", "ul", "ol", "li", "a", "b", "i", "u", "strong", "em", "hr"],
    ALLOWED_ATTR: ["href", "title", "class"],
  });
};
