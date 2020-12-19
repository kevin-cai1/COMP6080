# Tute 02

## 1. Code Review

Take a look at `http://www.cse.unsw.edu.au/~richardb/email.html` for review. Your tutor will break you into groups to take notes together on where this code can be improved. After some time spent in groups, your tutor will bring you back together to discuss issues you've found.

> Things to look out for include:
> * An over-reliance on inline styles
> * CSS definitions not reusing common definitions
> * CSS definitions not having very meaningful names
> * Overly complex HTML or CSS layouts
> * Lack of indentation or correct style for HTML/CSS

> Some obvious things with the Buckland page are:
>  * Capitalised HTML tags
>  * Lots of HTML tags aren't closed
>  * Use of `<blockquote>` and other tags to describe style, instead of CSS
>  * Use of HTML attributes (e.g. `bgcolor`) instead of CSS
>  * CSS file is named `.html`
>  * CSS file is inconsistently formatted

## 2. HTML/CSS from image

`airbnb.png` is a "Contact Us" page taken from the airbnb website.

Create a page in `airbnb.html` that uses HTML and CSS to produce a page that looks as close to the png as possible.

Hint: The font-family is `Circular`, which you don't have to replicate. Focus on structure, spacing, and font-sizes.

> See `solutions/airbnb.html`

## 3. Simple NodeJS script

### Writing the code

A javascript file that can be run with `node` has been created in `range.js`. The program must be completed by you. The program must read in a text file (one of `data1.txt`, `data2.txt`, or `data3.txt`) which contains integers on some of the lines. The program will determine the lowest and highest valued number, and print out the "range" (i.e. difference between max and min) as per the output below:
```txt
The range is 421.
```

Ensure your code works for all 3 data files. You must not import any libraries. Try and write it as standard C/python style as you can, don't try and overcomplicate things on the first run.

You can assume the first two lines of code don't need to be fully understood, but if you're familiar with python they should generally make sense.

```js
fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8');

const lines = data.split("\n");

let min = 99999999999;
let max = -99999999999;

for (const line of lines) {
  if (line != '') {
  	const number = parseInt(line);
  	if (min > number) {
  		min = number;
  	}
  	if (max < number) {
  		max = number;
  	}
  }
}

console.log('The range is ' + (max - min));
```

### Optimisations

(Optional) What improvements can we make to our code to make it more concise? Or employ other strategies discussed in lectures?

```js
fs = require('fs');
const data = fs.readFileSync('data.txt', 'utf8');

const lines = data.split("\n").filter(l => l !== '').map(l => parseInt(l));
console.log(`The range is ${Math.max(...lines) - Math.min(...lines)}`);
````

> Key things that have been changed are
>  * Usage of filter to remove empty lines from input data
>  * Usage of map to transform data from string to integer
>  * Use of back quotes to add for easy interpolation and avoid the use of `+` concatenation
>  * I'm sure there are many more
> Things that might need discussion are:
>  * How you can chain the map and the filter
>  * How map and filter are passed in functions
>  * The spread operator being used on lines to turn it from a single argument of a list, to a list of arguments that are just an integer each

## 4. Simple JS in the browser

We have created a webpage `me.html` that is just an empty HTML page where some javascript runs.

Using basic javascript knowledge, implement this page to console log "My name is X and my age is Y" when the page is loaded with the following added to the URL:

`me.html?name=francis&age=72`

You can access the URL of a webpage via the stub code we have provided. It returns the URL as a basic string.

```js
<script type="text/javascript">

const url = window.location.href;

const queryString = url.split('?')[1];
const pairs = queryString.split('&');
const urlData = {};
pairs.forEach(function (pairs) {
  const s = pairs.split('=');
  urlData[s[0]] = s[1];
});

const { name, age } = urlData; // Destructuring

console.log(`My name is ${name} and my age is ${age}`);

</script>
```

(Optional) Try to not only print the age, but dynamically print what year they were born assuming their birthday was on January 1st. Hint: Use the javascript built-in "Date" object.

```js
<script type="text/javascript">

const url = window.location.href;

const queryString = url.split('?')[1];
const pairs = queryString.split('&');
const urlData = {};
pairs.forEach(function (pairs) {
  const s = pairs.split('=');
  urlData[s[0]] = s[1];
});

const { name, age } = urlData; // Destructuring

console.log(`My name is ${name} and my age is ${age}`);

const age = 77;
const year = new Date().getYear() + 1900; // We have to add 1900
//  because getYear returns the number of years since 1900
console.log(`I was born January 1st ${year - age}`);
```

</script>
