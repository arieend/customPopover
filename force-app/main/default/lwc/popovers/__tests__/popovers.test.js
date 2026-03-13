import { createElement } from 'lwc';
import Popovers from 'c/popovers';

describe('c-popovers', () => {
    afterEach(() => {
        // The jsdom instance is shared across test cases in a single file so reset the DOM
        while (document.body.firstChild) {
            document.body.removeChild(document.body.firstChild);
        }
    });

    it('is hidden by default', () => {
        const element = createElement('c-popovers', {
            is: Popovers
        });
        document.body.appendChild(element);

        const popover = element.shadowRoot.querySelector('.popover');
        expect(popover.classList.contains('popover-hide')).toBe(true);
    });

    it('shows the popover on mouseover of the value slot container', async () => {
        const element = createElement('c-popovers', {
            is: Popovers
        });
        document.body.appendChild(element);

        const mainContent = element.shadowRoot.querySelector('.main-content slot[name="value"]');
        mainContent.dispatchEvent(new CustomEvent('mouseover', { bubbles: true }));

        // Wait for requestAnimationFrame and re-render
        await Promise.resolve();
        await new Promise(resolve => setTimeout(resolve, 0));

        const popover = element.shadowRoot.querySelector('.popover');
        expect(popover.classList.contains('popover-show')).toBe(true);
    });

    it('hides the popover on mouseleave when with-close is false', async () => {
        const element = createElement('c-popovers', {
            is: Popovers
        });
        element.withClose = false;
        document.body.appendChild(element);

        // Show it first
        const mainContent = element.shadowRoot.querySelector('.main-content slot[name="value"]');
        mainContent.dispatchEvent(new CustomEvent('mouseover', { bubbles: true }));
        
        await Promise.resolve();

        // Leave it
        mainContent.dispatchEvent(new CustomEvent('mouseleave', { bubbles: true }));
        await Promise.resolve();

        const popover = element.shadowRoot.querySelector('.popover');
        expect(popover.classList.contains('popover-hide')).toBe(true);
    });

    it('remains visible on mouseleave when with-close is true', async () => {
        const element = createElement('c-popovers', {
            is: Popovers
        });
        element.withClose = true;
        document.body.appendChild(element);

        const mainContent = element.shadowRoot.querySelector('.main-content slot[name="value"]');
        mainContent.dispatchEvent(new CustomEvent('mouseover', { bubbles: true }));
        
        await Promise.resolve();
        
        mainContent.dispatchEvent(new CustomEvent('mouseleave', { bubbles: true }));
        await Promise.resolve();

        const popover = element.shadowRoot.querySelector('.popover');
        expect(popover.classList.contains('popover-show')).toBe(true);
    });

    it('applies the correct variant class to the popover section', () => {
        const element = createElement('c-popovers', {
            is: Popovers
        });
        element.variant = 'brand';
        document.body.appendChild(element);

        const section = element.shadowRoot.querySelector('section');
        expect(section.classList.contains('slds-popover_brand')).toBe(true);
    });

    it('applies the correct size class to the popover section', () => {
        const element = createElement('c-popovers', {
            is: Popovers
        });
        element.size = 'large';
        document.body.appendChild(element);

        const section = element.shadowRoot.querySelector('section');
        expect(section.classList.contains('slds-popover_large')).toBe(true);
    });

    it('closes the popover when the close button is clicked', async () => {
        const element = createElement('c-popovers', {
            is: Popovers
        });
        element.withClose = true;
        document.body.appendChild(element);

        // Show it
        const mainContent = element.shadowRoot.querySelector('.main-content slot[name="value"]');
        mainContent.dispatchEvent(new CustomEvent('mouseover', { bubbles: true }));
        await Promise.resolve();

        const closeButton = element.shadowRoot.querySelector('button[title="Close dialog"]');
        closeButton.click();
        await Promise.resolve();

        const popover = element.shadowRoot.querySelector('.popover');
        expect(popover.classList.contains('popover-hide')).toBe(true);
    });
});