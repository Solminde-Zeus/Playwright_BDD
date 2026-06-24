Feature: Login Functionality
  As a user of the application
  I want to be able to log in and log out
  So that I can access secured areas of the site

  Background:
    Given user is on login page

  # TC_001
  Scenario: Successful login with valid credentials
    When user enters valid username and password
    And clicks on login button
    Then user should be navigated to dashboard

  # TC_002
  Scenario: Invalid login attempt
    When user enters invalid credentials
    Then error message should be displayed

  # TC_003
  Scenario: Verify error message visibility on empty credentials
    When user enters "" and ""
    Then login result should be "failure"
    And error message should be displayed

  # TC_004
  Scenario: Verify logout functionality
    When user enters valid username and password
    And clicks on login button
    Then user should be navigated to dashboard
    When user clicks logout
    Then user should be redirected to login page

  Scenario Outline: Login with multiple credentials
    When user enters "<username>" and "<password>"
    Then login result should be "<result>"

    Examples:
      | username  | password             | result  |
      | tomsmith  | SuperSecretPassword! | success |
      | tomsmith  | JayeshSolminde        | failure |
