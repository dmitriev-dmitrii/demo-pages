const template = document.createElement('template')
template.innerHTML = `<slot></slot>`

export default class RouterView extends HTMLElement {
    currentRoute = {}

    constructor() {
        super();
        const shadow  = this.attachShadow({mode:'open'})
        shadow.append(template.content.cloneNode(true))
    }

    connectedCallback() {
        //mounted
    }

    disconnectedCallback() {
        // "Unmount"
        // console.log('disconnectedCallback')
    }

    attributeChangedCallback(attribute, previousValue, currentValue) {
        // called when attributes are added, removed, or changed
        // console.log('attributeChangedCallback',attribute, previousValue, currentValue)
    }
}

