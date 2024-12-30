// accordionParser.js
import { ACCORDION_ICON_HTML } from "./constants";

export function parseAccordionsFromHtml(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;

  const h4Elements = Array.from(tempDiv.querySelectorAll("h4"));
  if (!h4Elements.length) {
    return html;
  }

  const accordionGroup = document.createElement("div");
  accordionGroup.setAttribute("data-accordion-group", "");

  function createAccordionItem(headingEl, contentEls) {
    const accordionItem = document.createElement("div");
    accordionItem.setAttribute("data-accordion", "");

    const controlDiv = document.createElement("div");
    controlDiv.setAttribute("data-control", "");

    // Use your icon from constants
    controlDiv.innerHTML = `${ACCORDION_ICON_HTML}${headingEl.innerHTML}`;

    const contentDiv = document.createElement("div");
    contentDiv.setAttribute("data-content", "");

    contentEls.forEach((el) => contentDiv.appendChild(el));

    accordionItem.appendChild(controlDiv);
    accordionItem.appendChild(contentDiv);
    return accordionItem;
  }

  // Loop through each <h4>, gather <p> siblings, etc. (same as before)
  for (let i = 0; i < h4Elements.length; i++) {
    const currentH4 = h4Elements[i];
    const nextH4 = h4Elements[i + 1];

    const contentEls = [];
    let sibling = currentH4.nextElementSibling;
    while (sibling && sibling !== nextH4) {
      if (sibling.tagName === "P") {
        contentEls.push(sibling);
      }
      sibling = sibling.nextElementSibling;
    }

    const accordionItem = createAccordionItem(currentH4, contentEls);
    accordionGroup.appendChild(accordionItem);
  }

  return accordionGroup.outerHTML;
}
