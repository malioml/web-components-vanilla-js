class Tooltip extends HTMLElement {
  constructor() {
    super();
    this._tooltipContainer;
    this._tooltipText = 'Some dummy tooltip text.';
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
        <style>
            div {
                background-color: black;
                color: white;
                position: absolute;
                z-index: 10;
            }
            .highlight {
                background-color: red;
            }
            
            ::slotted(.highlight) {
                border-bottom: 1px dotted red;
            }
            
            .icon {
                background: black;
                color: white;
                padding: 0.4rem 0.4rem;
                text-align: center;
                border-radius: 50%;
            }
        </style>
        <slot>Some default</slot>
        <span class="icon">(?)</span>
    `;
  }

  connectedCallback() {
    if (this.hasAttribute('Text')) {
      this._tooltipText = this.getAttribute('text');
    }
    const tooltipIcon = this.shadowRoot.querySelector('span');
    tooltipIcon.textContent = ' (?)';
    tooltipIcon.addEventListener('mouseenter', this._showTooltip.bind(this));
    tooltipIcon.addEventListener('mouseleave', this._hideTooltip.bind(this));
    this.shadowRoot.appendChild(tooltipIcon);
    this.style.position = 'relative';
  }

  _showTooltip() {
    this._tooltipContainer = document.createElement('div');
    this._tooltipContainer.textContent = this._tooltipText;
    this.shadowRoot.appendChild(this._tooltipContainer);
  }

  _hideTooltip() {
    this.shadowRoot.removeChild(this._tooltipContainer);
  }
}

customElements.define('uc-tooltip', Tooltip);