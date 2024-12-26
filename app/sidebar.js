import { useState } from 'react';

export default function Sidebar({ initialHtml }) {
    const [html, setHtml] = useState(initialHtml);

    const transformToAccordion = () => {
        const selection = window.getSelection();
        if (!selection.rangeCount) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        if (!selectedText) return;

        // Replace selected text with an accordion structure
        const accordionHtml = `
            <div data-accordion-group="">
                <div data-accordion="">
                    <div data-control="">
                        <h4>${selectedText}</h4>
                    </div>
                    <div data-content=""></div>
                </div>
            </div>
        `;

        // Replace selected text in the DOM
        const newHtml = html.replace(selectedText, accordionHtml);
        setHtml(newHtml);
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ flex: 1, padding: '10px' }}>
                <div dangerouslySetInnerHTML={{ __html: html }} />
            </div>
            <div style={{ width: '50px', position: 'fixed', left: 0, top: 0, background: '#f4f4f4', padding: '10px', height:'100%' }} class="bg-black">
                <button onClick={transformToAccordion}>Transform to Accordion</button>
            </div>
        </div>
    );
}
