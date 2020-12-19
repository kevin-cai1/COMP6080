# Tute 04

## 1. Mobile screen sizes

Your tutor will break you into groups of 3.

In each group, find a website that you think have very separate mobile and laptop/desktop layouts. For this webpage:
 * Write down it's URL
 * Identify the breakpoint of the page (the width that it tends to switch from mobile to larger)
 * Write down any key changes that occur (e.g. items collapsed into menu, limited functionality in mobile).

After you come back together, your tutor will go through a couple of groups work and discuss it with the class as a whole.

## 2. Building a Vanilla JS Form

Build a simple form in `form.html` that collects an email address and first name from a user before submitting it. We have provided some stub code.

Valid inputs:
 * A valid first name is defined as only lowercase and uppercase letters, between 2 and 20 characters long inclusively.
 * A valid email is defined by the regular expression `.+\@.+\..+` (read more on that here)[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions].

Important facts about form state:
 * The submit button remains disabled until both a valid firstName and valid email are entered. The state change occurs on keyup of either input fields.
 * On blur of either input fields, if their value is invalid, the background of the input is turned a light red.
 * On focus of either input fields, we removed any error backgrounds.

> See `solutions/form.html`

## 3. Basic ReactJS State

Use a basic HTML table to build a very simple "Tic-Tac-Toe" game. Users can turn clicking on cells, filling them with `X` or `O` depending on whose turn it is. You must build this with ReactJS via `create-react-app`.

As bonus exercises you may want to explore:
 * Using loops as part of rendering.
 * Accounting for the "finish" (goal) state.

![](board.png)

> See `solutions/tictactoe`
