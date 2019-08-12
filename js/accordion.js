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

  handleArrowKeyNavigation (className, event) {
    if (document.activeElement.classList.contains(className)) {
      const options = document.getElementsByClassName(className);
      const currentFocusedOptionIndex = parseInt(document.activeElement.id.split(className + '-')[1]);
  
      let targetIndex;
      switch (event.keyCode) {
      case 40:
        event.preventDefault();
        targetIndex = (currentFocusedOptionIndex + 1) % options.length;
        options[targetIndex].focus();
        break;
      case 38:
        event.preventDefault();
        targetIndex = currentFocusedOptionIndex === 0 ? options.length-1 : currentFocusedOptionIndex-1;
        options[targetIndex].focus();
        break;
      case 36:
        event.preventDefault();
        options[0].focus();
        break;
      case 35:
        event.preventDefault();
        options[options.length-1].focus();
        break;
      default:
        break;
      }
    }
  }


  onClick (index) {
    this.openIndex = this.openIndex === index ? null : index;
    this.render();
  }

  onKeyDown (event) {
    this.handleArrowKeyNavigation('accordion-header-button', event);
  }

  render () {
    const accordionRoot = document.createElement('div');
    accordionRoot.onkeydown = this.onKeyDown;

    this.items.forEach((item, i) => {
      // create button element
      const button = document.createElement('button');
      button.setAttribute('aria-expanded', this.openIndex === i);
      button.id = `accordion-header-button-${i}`;
      button.classList.add('accordion-header-button');
      button.classList.add(this.openIndex === i ? 'accordion-header-button--expanded' : 'accordion-header-button--collapsed');
      button.onclick = () => this.onClick(i);
      button.innerText = item.title;
      
      // create h3 element and append button
      const h3El = document.createElement('h3');
      h3El.classList.add('accordion-header');
      h3El.appendChild(button);

      // create container div and append h3
      const itemDiv = document.createElement('div');
      itemDiv.appendChild(h3El);

      // create and append body div (content)
      const bodyDiv = document.createElement('div');
      bodyDiv.classList.add('accordion-item');
      bodyDiv.classList.add(this.openIndex === i ? 'accordion-item--expanded' : 'accordion-item--collapsed');
      bodyDiv.setAttribute('aria-hidden', !(this.openIndex === i));
      bodyDiv.id = `accordion-item-${i}`;
      bodyDiv.innerHTML = item.body;
      itemDiv.appendChild(bodyDiv);

      accordionRoot.appendChild(itemDiv);
    });


    this.containerElement.innerHTML = '';
    this.containerElement.appendChild(accordionRoot);
  }
}