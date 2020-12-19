context('Admin flow - happy path', () => {
  beforeEach(() => {

  });

  it('Completes admin path', () => {
    cy.visit('localhost:3000');
    const name = 'Jane Doe';
    const email = 'janedoe@example.com';
    const password = 'passw0rd';
    
    // navigate to register page
    cy.get('button[name=register')
      .click()

    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=name]')
      .focus()
      .type(name);    

    cy.get('input[name=password]')
      .focus()
      .type(password);

    cy.get('button[type=submit]')
      .click();
    
    expect(cy.location('pathname').should('eq', '/home'));

    // create new game
    const quizName = 'Test Quiz';
    cy.get('button[name=create-quiz]')
      .click();
    
    cy.get('input[name=quiz-name')
      .focus()
      .type(quizName);

    cy.get('button[name=submit-quiz')
      .click();

    // start a game
    cy.get('button[id=quiz-toggle')
      .click();

    // validate that game has started
    cy.get('h2').then(el => {
      expect(el.text()).to.contain('Game Started');
    });

    // close current dialog popup
    cy.get('.MuiDialog-container')
      .click(-50, -50, {force: true});

    // end game
    cy.get('button[id=quiz-toggle]')
      .click();

    // validate that game has ended
    cy.get('h2').then(el => {
      expect(el.text()).to.contain('Game Finished');
    });

    // view results
    cy.get('button[name=view-results')
      .click();

    // check user is redirected to result page
    cy.url().should('match', /game\/\d+\/\d+\/results/);

    // log out of app
    cy.get('button[name=register')
      .click()

    expect(cy.location('pathname').should('eq', '/login'));
    
    // enter login details
    cy.get('input[name=email]')
      .focus()
      .type(email);

    cy.get('input[name=password]')
      .focus()
      .type(password);

    cy.get('button[type=submit]')
      .click();

    // logged back in
    expect(cy.location('pathname').should('eq', '/home'));
  })
});