import {push} from '../router.js'

const template = document.createElement('template')
template.innerHTML = `<a href=""><slot></slot></a>`
// TODO сделать чтобы компонент выглядел как обычная ссылка
const isDisabledAttributeMap = {
    "disabled" : true,
    'true': true,
    '': true,
    'false' : false,
    'null' : false,
    'undefined' : false,
}

export default class RouterLink extends HTMLElement {
    path = ''
    name = ''
    isDisabled = false
    constructor() {
        super();

        this.path = this.getAttribute('path');
        this.name = this.getAttribute('name');

        this.isDisabled = isDisabledAttributeMap[this.getAttribute('disabled')];

        const [hrefTag] =  template.content.children

        hrefTag.setAttribute('href',this.path)

        if (this.isDisabled) {
            return
        }

        const shadow  = this.attachShadow({mode:'open'})
        shadow.append(template.content.cloneNode(true))
    }

    async onClickHandle  (e) {

        e.preventDefault()

        if (this.isDisabled) {
            return
        }

        const { path, name} = this

        await  push({  path, name } )
    }


    connectedCallback() {

        this.addEventListener('click', this.onClickHandle )
        //mounted

    }

    disconnectedCallback() {
        // "Unmount"
        // console.log('disconnectedCallback')
    }

    attributeChangedCallback(attribute, previousValue, currentValue) {
        // called when attributes are added, removed, or changed
        // console.log('attributeChangedCallback', attribute, previousValue, currentValue)
    }
}

