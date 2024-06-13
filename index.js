let equipmentData = [],
    currentUom = 'metric',
    cardViews = [];

// Toggle the dialogs display to show or hide
function toggleModalVisibility(on) {
  const modal = document.getElementById('settings-modal');
  if (on) {
    modal.style.display = 'block';
  } else {
    modal.style.display = 'none';
  }
}

/**
 * Setup the initial event listeners needed in the application for the
 * static HTML elements that allow us to interact with the content.
 */
function initializeHandlers() {
  const categoryDropdown = document.getElementById('category');

  document.getElementById('search').addEventListener('keyup', (event) => {
    const searchTxt = event.target.value;
    
    const cards = document.querySelectorAll('.card-container');
    for (let i = 0; i < cards.length; i++) {
      const name = cards[i].querySelector('.title').textContent;
      if (searchTxt === '' || name.toLowerCase().includes(searchTxt.toLowerCase())) {
        cards[i].style.display = 'flex';
      } else {
        cards[i].style.display = 'none';
      }
    }
  });

  categoryDropdown.addEventListener('change', (event) => {
    document.getElementById('search').value = '';
    renderCards(equipmentData.filter(d => d.category === event.target.value));
  });

  document.getElementById('settings').addEventListener('click', () => {
    toggleModalVisibility(true);
  });

  document.getElementById('modal-close').addEventListener('click', () => {
    toggleModalVisibility(false);
  });

  document.getElementById('modal-done').addEventListener('click', () => {
    toggleModalVisibility(false);
  });

  // onchange of radio we should update the cards BUT we
  // should keep flipped cards in their flipped state too
  const uomOptions = document.querySelectorAll('input[name="uom"]');
  for (let i = 0; i < uomOptions.length; i++) {
    uomOptions[i].addEventListener('change', (event) => {
      if (currentUom !== event.target.value) {
        currentUom = event.target.value;
        renderCards(equipmentData.filter(d => d.category === categoryDropdown.value));
      }
    });
  }

  // provide a way for the user to click away when the settings modal is
  // shown and auto dismiss it
  window.onclick = (event) => {
    const modal = document.getElementById('settings-modal');

    if (event.target === modal) {
      toggleModalVisibility(false);
    }
  };
}

/**
 *  Renders the the specification details on the back of the equipment card.
 */
function renderSpecifications(el, specifications) {
  el.replaceChildren();

  specifications.forEach(s => {
    const specTemp = document.getElementsByTagName('template')[2];
    const spec = specTemp.content.cloneNode(true);
    
    spec.querySelector('.item').innerHTML = s.label;
    spec.querySelector('.value').innerHTML = currentUom === 'imperial' ? s.us : s.metric;

    el.appendChild(spec);
  });
}

/**
 * Renders the equipment cards via the template and builds out the content within each card. 
 */
function renderCards(equipment) {
  const container = document.querySelector('.cards-container');

  container.replaceChildren();

  equipment.forEach((model, index) => {
    const cardTemp = document.getElementsByTagName('template')[0];
    const card = cardTemp.content.cloneNode(true);

    card.querySelector('.title').innerHTML = model.name;
    card.querySelector('.machine-image').src = model.image;

    const facts = card.querySelector('.facts');
    model.keySpecs.forEach(spec => {
      const factTemp = document.getElementsByTagName('template')[1];
      const fact = factTemp.content.cloneNode(true);
      
      fact.querySelector('.fact-text').innerHTML += `${spec.label}: ${currentUom === 'imperial' ? spec.us : spec.metric}`;

      facts.appendChild(fact);
    });

    const specCategoriesSet = new Set();
    model.specifications.forEach(spec => specCategoriesSet.add(spec.category));

    const specificationCategories = Array.from(specCategoriesSet).sort();
    const sectionsDropdown = card.getElementById('sections');
    specificationCategories.forEach(category => {
      const opt = document.createElement('option');
      opt.value = category;
      opt.innerHTML = category;
      sectionsDropdown.appendChild(opt);
    });
    sectionsDropdown.value = specificationCategories[0];

    const specs = card.querySelector('.specifications');
    renderSpecifications(
      specs,
      model.specifications.filter(s => s.category === specificationCategories[0])
    );

    container.appendChild(card);

    const currentEl = container.lastElementChild;
    currentEl.querySelector('.specification-btn').addEventListener('click', () => {
      const inner = currentEl.querySelector('.card-inner').classList;
      inner.add('is-flipped');
      cardViews[index] = 1;
    });

    currentEl.querySelector('.back-control').addEventListener('click', () => {
      const inner = currentEl.querySelector('.card-inner').classList;
      inner.remove('is-flipped');
      cardViews[index] = 0;
    });

    currentEl.querySelector('#sections').addEventListener('change', (event) => {
      renderSpecifications(
        specs,
        model.specifications.filter(s => s.category === event.target.value)
      );
    });

    if (cardViews[index]) {
      const inner = currentEl.querySelector('.card-inner').classList;
      inner.add('is-flipped');
    }
  });
}

/**
 * Entry point, read from the equipment data and then populate the initial
 * components on the screen with the information.
 */
fetch('data/equipment.json')
  .then(response => response.text())
  .then(data => {
    equipmentData = JSON.parse(data);

    // Since we have an array of equipment and each equipment belongs
    // to a specific category, i.e. "Backhoes", we want to get a unique
    // set of the categories
    const categories = new Set();
    equipmentData.forEach(c => categories.add(c.category));

    // Get the categories from the Set we created above,
    // converting the iterator to an array and then sorting
    // alphanumerically
    const keys = Array.from(categories.keys()).sort();
    
    const categoryDropdown = document.getElementById('category');
    
    // Create the dropdown list of unique categories
    for (let i = 0; i < keys.length; i++) {
      const opt = document.createElement('option');
      opt.value = keys[i];
      opt.innerHTML = keys[i];
      categoryDropdown.appendChild(opt);
    }

    // Set the <select>'s value to the first category by default
    categoryDropdown.value = keys[0];

    initializeHandlers();

    renderCards(equipmentData.filter(d => d.category === keys[0]));
  })
  .catch(error => {
    /* eslint-disable-next-line no-console */
    console.error('failed to get equipment data', error);
  });