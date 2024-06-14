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