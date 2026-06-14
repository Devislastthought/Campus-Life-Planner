Student Finance Tracker

A simple and easy to use expense tracker designed for students who want to manage their spending without creating an account or installing extra software built with HTML, CSS and JavaScript, all your data stays on your device.

About the Project

Student Finance Tracker helps users keep track of daily expenses, organize spending by category,set monthly budgets,search through records, and export data when needed.

Whether budgeting for food,transport,entertainment or school supplies,the application provides a straightforward way to manage personal finances.

Getting Started

Download or clone the project.

Open index.html in any modern web browser such as Chrome,Firefoxor Edge.

No installation or setup is required.

To run the built in tests open tests.html.

To explore the app with sample data, go to Records, select Import JSON, and choose seed.json.

Features
Expense Management

Add new expense records.

Edit existing records.

Delete records that are no longer needed.

Sort expenses by date, description, or amount.

Smart Search

Search records instantly using regular expressions.

Matching text is highlighted for easier browsing.

Dashboard

View total spending.

See the highest spending category.

Track recent activity with a seven-day spending chart.

Budget Tracking

Set a monthly spending limit.

Receive notifications when approaching or exceeding the budget.

Currency Conversion

Convert USD values to EUR and GBP.

Adjust exchange rates manually.

Custom Categories

Create custom spending categories.

Remove categories that are no longer needed.

Data Management

Import expense records from JSON files.

Export data for backup or sharing.

Save data automatically using browser local storage.

A mouse is not required to access any feature.

Accessibility

The application includes several accessibility features.

Semantic HTML5 structure.

Labels for all form controls.

Visible keyboard focus indicators.

Skip-to-content navigation.

Live announcements for budget updates and warnings.

Accessible error messages.

Labels for icon-only buttons.

High color contrast for readability.

Support for reduced motion preferences.
 The test suite checks input validation functions, regular expression compilation, search highlighting, import validation, and handling of invalid input.

Expense Record Format
{
  "id": "rec_0001_1234567890",
  "description": "Lunch at cafeteria",
  "amount": 12.50,
  "category": "Food",
  "date": "2025-09-25",
  "createdAt": "2025-09-25T12:00:00.000Z",
  "updatedAt": "2025-09-25T12:00:00.000Z"
}
Data Storage

All expense records and settings are stored locally in the browser using localStorage.no account or internet connection is required, and user data remains on the device.

Project Goal

Student Finance Tracker was created to provide students with a practical and accessible way to manage expenses, develop better spending habits and stay within their budget using a simple and responsive interface.
