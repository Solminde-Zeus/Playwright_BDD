Feature: Form Submission
  As a user of the application
  I want to fill and submit forms
  So that my data is saved successfully

  Background:
    Given user is on form page

  # TC_005 Here we are putting only 2 data
  Scenario: Submit form with all valid fields
    When user fills the form with following data:
      | field | value          |
      | name  |  JAyesh Solminde       |
      | email | zeuslearning@yeppe.com  |
    Then form should be submitted successfully

  # TC_006 HEre we are putting only 1 data
  Scenario: Submit form with name only
    When user fills the form with following data:
      | field | value     |
      | name  | Jayesh Solminde |
    Then form should be submitted successfully

  # TC_007 Here we are filling all the data
  Scenario: Submit form with all fields
    When user fills the form with following data:
      | field        | value             |
      | name         | Jayesh Solminde     |
      | email        | zeuslearning@yepe.com |
      | currentAddress | lower Parel West |
      | permanentAddress | Virar West  |
    Then form should be submitted successfully

  Scenario Outline: Submit form with parameterised data
    When user fills the form with name "<name>" and email "<email>"
    Then form submission result should be "<result>"

    Examples:
      | name       | email             | result  |
      | Jayesh Solminde   | zeuslearning@yeppe.com     | success |
      | Solminde Jayesh | zeuslearning@yepe.com     | success |
      |            | mumbaizeus@yeppe.com   | success |
