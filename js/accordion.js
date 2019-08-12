'use strict';

// eslint-disable-next-line no-unused-vars
class Accordion {
  constructor (items, containerId) {
    this.items = items;
    this.containerElement = document.getElementById(containerId);
    this.openIndex = null;

    this.onClick = this.onClick.bind(this);
    this.render = this.render.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  handleArrowKeyNavigation (className, keyCode) {
    if (document.activeElement.className === className) {
      const options = document.getElementsByClassName(className);
      const currentFocusedOptionIndex = parseInt(document.activeElement.id.split(className + '-')[1]);
  
      let targetIndex;
      switch (keyCode) {
      case 40:
        targetIndex = (currentFocusedOptionIndex + 1) % options.length;
        options[targetIndex].focus();
        break;
      case 38:
        targetIndex = currentFocusedOptionIndex === 0 ? options.length-1 : currentFocusedOptionIndex-1;
        options[targetIndex].focus();
        break;
      case 36:
        options[0].focus();
        break;
      case 35:
        options[options.length-1].focus();
        break;
      default:
        break;
      }
    }
  }


  onClick (event, index) {
    this.openIndex = this.openIndex === index ? null : index;
    this.render();
  }

  onKeyDown (event) {
    this.handleArrowKeyNavigation('accordion-header', event.keyCode);
  }

  render () {
    const accordionRoot = document.createElement('div');
    accordionRoot.onkeydown = this.onKeyDown;

    this.items.forEach((item, i) => {
      const button = document.createElement('button');
      button.setAttribute('aria-expanded', this.openIndex === i);
      button.id = `accordion-header-${i}`;
      button.onclick = e => this.onClick(e, i);
      button.classList.add('accordion-header');
      button.innerText = item.title;

      const h3El = document.createElement('h3');
      h3El.appendChild(button);

      const itemDiv = document.createElement('div');
      itemDiv.appendChild(h3El);

      if (this.openIndex === i) {
        const bodyDiv = document.createElement('div');
        bodyDiv.classList.add('accordion-item');
        bodyDiv.id = `accordion-item-${i}`;
        bodyDiv.innerHTML = item.body;

        itemDiv.appendChild(bodyDiv);
      }

      accordionRoot.appendChild(itemDiv);
    });


    this.containerElement.innerHTML = '';
    this.containerElement.appendChild(accordionRoot);
  }
}