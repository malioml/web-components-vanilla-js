class Modal extends HTMLElement {
  constructor() {
    super();
    this.isOpen = false;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        #backdrop {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            background: rgba(0,0,0,0.75);
            z-index: 10;
            opacity: 0;
            pointer-events: none;
        }
        
        :host([opened]) #backdrop{
            opacity: 1;
            pointer-events: all;    
        }
        
        #modal {
            position: fixed;
            top: 15vh;
            left: 25%;
            width: 50%;
            z-index: 100;
            background: white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.26);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            opacity: 0;
            pointer-events: none;          
        }
        
        :host([opened]) #modal{
            opacity: 1;
            pointer-events: all;    
        }
        
        
        header {
            padding: 1rem;
        }
        
        ::slotted(h1) {
            font-size: 1.25rem;
        }
        
        #main {
            padding: 1rem;
        }
        
        #actions {
            border-top: 1px dotted #ccc;
            padding: 1rem;
            display: flex;
            justify-content: flex-end;
        }
        
        #actions button {
            margin: 0 0.25rem;
        }
        
      </style>
      <div id="backdrop"></div>
      <div id="modal">
        <header>
            <slot name="title">Please Confirm Payment</slot>
        </header>
        <section id="main">
            <slot></slot>
        </section>
        <section id="actions">
            <button id="cancel-btn">Cancel</button>
            <button id="confirm-btn">Okay</button>
        </section>
      </div>
    `;
    const slots = this.shadowRoot.querySelectorAll('slot');
    slots[1].addEventListener('slotchange', event => {
      console.dir(slots[1].assignedNodes());
    });
    const cancelButton = this.shadowRoot.querySelector('#cancel-btn');
    const confirmButton = this.shadowRoot.querySelector('#confirm-btn');
    cancelButton.addEventListener('click', this._cancel.bind(this));
    confirmButton.addEventListener('click', this._confirm.bind(this));
  }

  hide() {
    if (this.hasAttribute('opened')) {
      this.removeAttribute('opened');
    }
    this.isOpen = false;
  }

  open() {
    this.setAttribute('opened', '');
  }

  _cancel(event) {
    this.hide();
    //bubbless -> search up until find parent with listener
    //composed -> true -> event leaves from shadow DOM.
    const cancelEvent = new Event('cancel', { bubbless: true, composed: true  });
    event.target.dispatchEvent(cancelEvent);
  }

  _confirm() {
    this.hide();
    const confirmEvent = new Event('confirm');
    this.dispatchEvent(confirmEvent);
  }

  attributesChangedCallback(name, oldValue, newValue) {
    if (this.hasAttribute('opened')) {
      this.isOpen = true;
    } else {
      this.isOpen = false;
    }
  }

  static get observerAttributes() {
    return ['opened'];
  }

}

customElements.define('uc-modal', Modal);