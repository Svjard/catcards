describe('CatCards', () => {
  describe('Header', () => {
    it ('should load with title', () => {
      cy.visit('/');
      cy.get('header').should('exist');

      const title = cy.get('.title');
      title.should('exist');
      title.contains('Cat Digital Cards');
    });

    it ('should load the list of categories', () => {
      cy.visit('/');
      cy.wait(300);

      const categories = cy.get('#category');
      categories.should('exist');
      categories.find('option').should('have.length', 40);
    });

    it ('should show the unit system icon', () => {
      cy.visit('/');
      cy.wait(300);

      const settings = cy.get('#settings');
      settings.should('exist');
    });
  });
});