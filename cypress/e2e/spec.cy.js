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

  describe('Search', () => {
    it ('should have a search bar at top of the container', () => {
      cy.visit('/');
      cy.get('#search').should('exist');
    });

    it ('should hide cards when typing in the search bar', () => {
      cy.visit('/');
      cy.wait(300);

      const search = cy.get('#search');
      search.type('HD');
      cy.get('.card-container[style*="display: flex"]').should('have.length', 1);
      cy.get('.card-container[style*="display: none"]').should('have.length', 5);
    });

    it ('should show all cards when clearing search bar', () => {
      cy.visit('/');
      cy.wait(300);

      const search = cy.get('#search');
      search.clear('');
      cy.get('.card-container[style*="display: flex"]').should('have.length', 6);
      cy.get('.card-container[style*="display: none"]').should('have.length', 0);
    });
  });

  describe('Unit System Modal', () => {
    it('should open the modal when clicking the options icon', () => {
      cy.visit('/');
      cy.wait(300);

      cy.get('#settings').click();
      cy.wait(1000);

      cy.get('#settings-modal').should('be.visible');
    });

    it('should close the modal when clicking the close icon', () => {
      cy.visit('/');
      cy.wait(300);

      cy.get('#settings').click();
      cy.wait(300);
      
      cy.get('#modal-close').click();
      cy.wait(300);

      cy.get('#settings-modal').should('not.be.visible');
    });

    it('should close the modal when clicking the done button', () => {
      cy.visit('/');
      cy.wait(300);

      cy.get('#settings').click();
      cy.wait(300);

      cy.get('#modal-done').click();
      cy.wait(300);

      cy.get('#settings-modal').should('not.be.visible');
    });

    it('should change our unit system successfully', () => {
      cy.visit('/');
      cy.wait(300);

      const firstCard = cy.get('.cards-container').children('.card-container').eq(0);

      firstCard.get('.fact-text:first').then(el => {
        const origText = el.text();

        cy.get('#settings').click();
        cy.wait(300);

        cy.get('[type="radio"]').check('imperial');
        cy.wait(300);

        firstCard.get('.fact-text:first').should('not.have.text', origText);
      });
    });
  });
});