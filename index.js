let equipmentData = [];

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
  })
  .catch(error => {
    /* eslint-disable-next-line no-console */
    console.error('failed to get equipment data', error);
  });