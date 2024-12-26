import fs from 'fs';
import path from 'path';
import { marked } from 'marked';

// Helper functions
const toTitleCase = (text) =>
    text
        .toLowerCase()
        .split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

const extractTitleFromUrl = (url) => {
    const cleanUrl = url.split(/[?#]/)[0];
    const parts = cleanUrl.split('/');
    const lastPart = parts[parts.length - 1] || parts[parts.length - 2];
    return toTitleCase(lastPart.replace(/-/g, ' '));
};

const addTitlesToLinks = (markdown) => {
    const linkRegex = /\[([^\]]+)\]\(([^ )]+)(?: \"([^\"]*)\")?\)/g;

    // Process regular links
    markdown = markdown.replace(linkRegex, (match, text, url, existingTitle) => {
        if (url.startsWith('http:')) {
            url = url.replace(/https?:\/\/[^/]+/, '');
        }
        if (url.startsWith('tel:')) {
            return `<a href="${url}" data-phone-number="" title="Call Us">${text}</a>`;
        }

        const title = existingTitle || extractTitleFromUrl(url);
        return `<a href="${url}" title="${title}">${text}</a>`;
    });

    return markdown;
};

const replaceImagePlaceholder = (markdown) => {
    const imageRegex = /\[Image\]/g;

    return markdown.replace(
        imageRegex,
        `<img data-src="/portals/0/" alt="Image Description" title="" width="" height="" class="lazyload"/>`
    );
};

const addAccordionComments = (markdown) => {
    const pages = markdown.split(/\n---\n/);

    return pages
        .map((page) => {
            let lines = page.split('\n');
            let inAccordion = false;
            lines = lines.map((line) => {
                if (line.startsWith('####') && !inAccordion) {
                    inAccordion = true;
                    return `<!-- ACCORDION -->\n${line}`;
                } else if (!line.startsWith('####') && line.match(/^#{1,3}\s/) && inAccordion) {
                    inAccordion = false;
                    return `<!-- ACCORDION END -->\n${line}`;
                }
                return line;
            });
            if (inAccordion) {
                lines.push('<!-- ACCORDION END -->');
            }
            return lines.join('\n');
        })
        .join('\n\n---\n\n');
};

const addPageComments = (markdown) => {
    const pages = markdown.split('---');

    return pages
        .map((page) => {
            const match = page.match(/^#\s+(.*)/m);
            const title = match ? match[1].trim() : 'Untitled Page';

            return `<!--------- ${title.toUpperCase()} --------->\n\n${page}`;
        })
        .join('\n\n---\n\n');
};

const replaceFirstH1WithTitleTag = (html) => {
    return html.replace(/<h1>(.*?)<\/h1>/i, '<title>$1</title>');
};


marked.setOptions({
    gfm: true, // Enable GitHub-flavored Markdown
    breaks: true, // Convert line breaks into <br>
    smartLists: true, // Use smart lists for bullet points
    smartypants: true, // Use smart typography
});

export default function handler(req, res) {
    if (req.method === 'POST') {
        const { markdown } = req.body;

        if (!markdown) {
            return res.status(400).json({ error: 'Markdown content is required' });
        }

        try {
            // Process the markdown
            console.log("Original Markdown:", markdown);
            let processedMarkdown = replaceImagePlaceholder(markdown);
            console.log("After replaceImagePlaceholder:", processedMarkdown);
            processedMarkdown = addTitlesToLinks(processedMarkdown);
            console.log("After addTitlesToLinks:", processedMarkdown);
            processedMarkdown = addAccordionComments(processedMarkdown);
            console.log("After addAccordionComments:", processedMarkdown);
            processedMarkdown = addPageComments(processedMarkdown);
            console.log("After addPageComments:", processedMarkdown);

            // Parse markdown to HTML
            let html = marked.parse(processedMarkdown);
            console.log("Generated HTML:", html);

            html = replaceFirstH1WithTitleTag(html);

            res.status(200).json({ processedMarkdown, html });
        } catch (error) {
            res.status(500).json({
                error: 'Error processing markdown',
                details: error.message,
            });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
