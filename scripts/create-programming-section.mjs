#!/usr/bin/env node
// Creates the "Intro to Programming" category and its lessons.
// Original content — same curriculum shape as any standard intro-to-CS
// course (variables, loops, functions, etc. are universal concepts, not
// anyone's proprietary text), written fresh for this site, not copied from
// anywhere. Illustrative examples use JavaScript syntax throughout, since
// that's consistent with the rest of the site's teaching track.
import fs from 'node:fs/promises'
import { createClient } from '@supabase/supabase-js'
import { nanoid } from 'nanoid'

const raw = await fs.readFile('.env.local', 'utf8')
const env = Object.fromEntries(raw.split('\n').filter(l => l.includes('=') && !l.trim().startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim()] }))
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY)

const DRY_RUN = process.argv.includes('--dry-run')

// ── Block builders ──────────────────────────────────────────────────────

function h(level, text) {
  const anchor = text.toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-')
  return { id: nanoid(12), type: 'heading', level, text, anchor }
}
function p(html) { return { id: nanoid(12), type: 'richtext', html } }
function code(language, codeText) { return { id: nanoid(12), type: 'code', language, code: codeText.trim() } }
function callout(variant, html, title) { return { id: nanoid(12), type: 'callout', variant, title, html } }
function table(header, rows) { return { id: nanoid(12), type: 'table', header, rows } }

function toc(blocks) {
  return blocks.filter(b => b.type === 'heading').map(b => ({ id: b.anchor, text: b.text, level: b.level }))
}

// ── Lessons ──────────────────────────────────────────────────────────────

const lessons = []

lessons.push({
  slug: 'intro', title: 'What is Programming?', blocks: [
    p('<p>Programming is how you give a computer instructions. A computer does not understand English, or intent, or "what you meant" — it only follows exact, unambiguous steps written in a language it can process. Programming is the skill of breaking a problem down into those steps.</p>'),
    h(2, 'Why learn to program?'),
    p('<p>Every app, website, and piece of software you use runs on code someone wrote. Learning to program lets you build tools instead of only using them — automate a repetitive task, build a website, analyze data, or make a game. It is also a way of thinking: breaking big, vague problems into small, precise ones is useful even outside a computer.</p>'),
    h(2, 'What does code actually look like?'),
    p('<p>Here is a tiny complete program. Do not worry about understanding every word yet — every part of it is covered in the lessons that follow.</p>'),
    code('javascript', `let name = "Ada";
let age = 28;

if (age >= 18) {
  console.log(name + " is an adult.");
} else {
  console.log(name + " is a minor.");
}`),
    p('<p>This program stores two pieces of information (a name and an age), makes a decision based on the age, and prints a message. Storing information, making decisions, and repeating actions are the three ideas almost every program is built from.</p>'),
    h(2, 'How this section is organized'),
    p('<p>Each lesson covers one building block — variables, data types, loops, functions, and so on — with runnable examples in JavaScript. The concepts themselves are not specific to JavaScript; once you understand what a "loop" or a "function" is, you can recognize the same idea in any programming language.</p>'),
    callout('tip', '<p>You do not need to install anything to follow along. Every code example on this site can be edited and run directly in the page.</p>', 'No setup required'),
  ]
})

lessons.push({
  slug: 'variables', title: 'Variables', blocks: [
    p('<p>A variable is a named container for a value. Instead of writing the number <code>25</code> everywhere in your code, you can store it once in a variable and refer to it by name — which makes code easier to read and easier to change.</p>'),
    h(2, 'Declaring a variable'),
    p('<p>In JavaScript, you declare a variable with <code>let</code> and give it a value with <code>=</code>:</p>'),
    code('javascript', `let score = 0;
let playerName = "Alex";

console.log(score);       // 0
console.log(playerName);  // Alex`),
    h(2, 'Variables can change'),
    p('<p>The whole point of a variable is that its value can change while the program runs — that\'s where the name comes from.</p>'),
    code('javascript', `let score = 0;
score = 10;
score = score + 5;

console.log(score); // 15`),
    h(2, 'Naming rules'),
    p('<p>A variable name must start with a letter, <code>_</code>, or <code>$</code> — not a digit — and can\'t contain spaces. Good names describe what the value is for.</p>'),
    table(
      ['Good', 'Works, but unclear'],
      [['userAge', 'x'], ['totalPrice', 'tp'], ['isLoggedIn', 'flag1']]
    ),
    callout('note', '<p>JavaScript variable names are case-sensitive: <code>score</code> and <code>Score</code> are two different variables.</p>'),
  ]
})

lessons.push({
  slug: 'constants', title: 'Constants', blocks: [
    p('<p>A constant is like a variable, except its value can never change after it\'s set. Use a constant whenever a value should stay fixed for the life of the program — it protects you from accidentally overwriting something you didn\'t mean to.</p>'),
    h(2, 'Declaring a constant'),
    p('<p>In JavaScript, use <code>const</code> instead of <code>let</code>:</p>'),
    code('javascript', `const pi = 3.14159;
const siteName = "Learn Computer Academy";

console.log(pi); // 3.14159`),
    p('<p>Trying to reassign a constant is an error — JavaScript stops you on purpose:</p>'),
    code('javascript', `const pi = 3.14159;
pi = 3.14; // ❌ TypeError: Assignment to constant variable.`),
    h(2, 'When to use const vs. let'),
    p('<p>A common habit among experienced programmers: default to <code>const</code>, and only switch to <code>let</code> when you know a value genuinely needs to change later (like a counter or a score). It makes code easier to reason about — if you see <code>const</code>, you know that value is fixed for good.</p>'),
  ]
})

lessons.push({
  slug: 'data-types', title: 'Data Types', blocks: [
    p('<p>Every value in a program has a type, which determines what kind of data it is and what you can do with it. A number can be added; text can be joined; a true/false value can be used in a decision.</p>'),
    h(2, 'The basic types'),
    table(
      ['Type', 'Example', 'Description'],
      [
        ['Number', '<code>42</code>, <code>3.14</code>', 'Whole or decimal numbers'],
        ['String', '<code>"hello"</code>', 'Text, wrapped in quotes'],
        ['Boolean', '<code>true</code>, <code>false</code>', 'A yes/no, on/off value'],
        ['Undefined', '<code>undefined</code>', 'A variable that has been declared but has no value yet'],
        ['Null', '<code>null</code>', 'An intentionally empty value'],
      ]
    ),
    h(2, 'Checking a value\'s type'),
    p('<p>JavaScript\'s <code>typeof</code> operator tells you what type a value is — useful while learning, and occasionally in real code too.</p>'),
    code('javascript', `console.log(typeof 42);        // "number"
console.log(typeof "hello");   // "string"
console.log(typeof true);      // "boolean"
console.log(typeof undefined); // "undefined"`),
    callout('note', '<p>Numbers and strings that look similar behave very differently: <code>"5" + "5"</code> joins two pieces of text into <code>"55"</code>, while <code>5 + 5</code> adds two numbers into <code>10</code>. Mixing up a number and a string that contains digits is one of the most common early bugs.</p>'),
  ]
})

lessons.push({
  slug: 'type-casting', title: 'Type Casting', blocks: [
    p('<p>Type casting (also called type conversion) means converting a value from one type to another — turning the text <code>"42"</code> into the number <code>42</code>, for example. It matters because a value read from a form, a file, or user input often arrives as text, even when it represents a number.</p>'),
    h(2, 'Converting text to a number'),
    code('javascript', `let input = "25";
let age = Number(input);

console.log(age);         // 25
console.log(age + 5);     // 30 — real addition now, not text joining`),
    h(2, 'Converting a number to text'),
    code('javascript', `let count = 7;
let message = "You have " + String(count) + " items.";

console.log(message); // "You have 7 items."`),
    h(2, 'What happens if the conversion fails'),
    p('<p>Not every piece of text is a valid number. Converting something that isn\'t produces a special value called <code>NaN</code> ("Not a Number") rather than crashing the program.</p>'),
    code('javascript', `console.log(Number("hello")); // NaN
console.log(Number("42"));   // 42`),
  ]
})

lessons.push({
  slug: 'operators', title: 'Operators', blocks: [
    p('<p>Operators are the symbols that do work on values — adding numbers, comparing them, combining true/false conditions. This lesson covers the five kinds you\'ll use constantly.</p>'),
    h(2, 'Arithmetic Operators'),
    p('<p>Used for math.</p>'),
    table(
      ['Operator', 'Meaning', 'Example'],
      [['+', 'Addition', '5 + 2 → 7'], ['-', 'Subtraction', '5 - 2 → 3'], ['*', 'Multiplication', '5 * 2 → 10'], ['/', 'Division', '5 / 2 → 2.5'], ['%', 'Remainder (modulo)', '5 % 2 → 1']]
    ),
    h(2, 'Assignment Operators'),
    p('<p>Used to give a variable a value, often combined with a calculation.</p>'),
    code('javascript', `let score = 10;
score += 5;  // same as: score = score + 5
console.log(score); // 15`),
    h(2, 'Comparison Operators'),
    p('<p>Compare two values and produce <code>true</code> or <code>false</code>.</p>'),
    table(
      ['Operator', 'Meaning'],
      [['===', 'Equal to (checks type too)'], ['!==', 'Not equal to'], ['>', 'Greater than'], ['<', 'Less than'], ['>=', 'Greater than or equal to']]
    ),
    code('javascript', `console.log(5 === 5);   // true
console.log(5 === "5"); // false — different types
console.log(7 > 3);     // true`),
    h(2, 'Logical Operators'),
    p('<p>Combine or invert true/false values.</p>'),
    table(
      ['Operator', 'Meaning', 'Example'],
      [['&&', 'AND — both must be true', 'true && false → false'], ['||', 'OR — at least one true', 'true || false → true'], ['!', 'NOT — flips the value', '!true → false']]
    ),
    h(2, 'Bitwise Operators'),
    p('<p>Work directly on the binary representation of numbers, bit by bit. You will use these far less often than the operators above, but they show up in low-level code, graphics, and permission flags.</p>'),
    code('javascript', `console.log(5 & 1);  // 1  — AND on the underlying bits
console.log(5 | 2);  // 7  — OR on the underlying bits`),
    callout('tip', '<p>Bitwise operators make a lot more sense after the <a href="/programming/binary-numbers">Binary Numbers</a> lesson — it\'s fine to skim this section for now and come back to it.</p>'),
  ]
})

lessons.push({
  slug: 'comments', title: 'Comments', blocks: [
    p('<p>A comment is text in your code that the computer ignores completely — it\'s there for humans, not the machine. Comments explain *why* code does something, especially anything that isn\'t obvious from the code itself.</p>'),
    h(2, 'Single-line comments'),
    code('javascript', `// This calculates the total price including tax
let total = price * 1.18;`),
    h(2, 'Multi-line comments'),
    code('javascript', `/*
  This function validates a user's age.
  It returns true only if the age is a realistic human age.
*/
function isValidAge(age) {
  return age > 0 && age < 130;
}`),
    h(2, 'When to comment'),
    p('<p>Good code with clear variable and function names often needs very few comments — the code explains itself. Comment when the *why* isn\'t obvious: a workaround for a bug, a non-obvious business rule, or a warning about something easy to break.</p>'),
    callout('warning', '<p>A comment that just restates the code adds noise, not value: <code>// add 1 to x</code> above <code>x = x + 1;</code> tells you nothing you couldn\'t already see.</p>'),
  ]
})

lessons.push({
  slug: 'if-statements', title: 'If Statements', blocks: [
    p('<p>An if statement lets your program make a decision — run one block of code if a condition is true, and optionally a different block if it\'s false.</p>'),
    h(2, 'Basic if'),
    code('javascript', `let temperature = 35;

if (temperature > 30) {
  console.log("It's hot today.");
}`),
    h(2, 'if / else'),
    code('javascript', `let age = 15;

if (age >= 18) {
  console.log("You can vote.");
} else {
  console.log("Not old enough to vote yet.");
}`),
    h(2, 'if / else if / else'),
    p('<p>Chain multiple conditions when there are more than two possible outcomes.</p>'),
    code('javascript', `let score = 72;

if (score >= 90) {
  console.log("Grade: A");
} else if (score >= 75) {
  console.log("Grade: B");
} else if (score >= 60) {
  console.log("Grade: C");
} else {
  console.log("Grade: F");
}
// Output: Grade: C`),
    callout('note', '<p>Only the first matching condition runs — once one branch is chosen, JavaScript skips the rest, even if a later condition would also have been true.</p>'),
  ]
})

lessons.push({
  slug: 'loops', title: 'Loops', blocks: [
    p('<p>A loop repeats a block of code multiple times, so you don\'t have to write it out by hand. Loops are how programs process lists of data, repeat a task a fixed number of times, or keep running until some condition is met.</p>'),
    h(2, 'The for loop'),
    p('<p>Use a <code>for</code> loop when you know how many times you want to repeat something.</p>'),
    code('javascript', `for (let i = 1; i <= 5; i++) {
  console.log("Count: " + i);
}
// Prints Count: 1 through Count: 5`),
    p('<p>A <code>for</code> loop has three parts, separated by semicolons: a starting point (<code>let i = 1</code>), a condition checked before every repeat (<code>i <= 5</code>), and a step that runs after every repeat (<code>i++</code>).</p>'),
    h(2, 'The while loop'),
    p('<p>Use a <code>while</code> loop when you don\'t know in advance how many repeats you need — it keeps going as long as a condition stays true.</p>'),
    code('javascript', `let energy = 3;

while (energy > 0) {
  console.log("Still going, energy: " + energy);
  energy = energy - 1;
}`),
    callout('warning', '<p>If the condition in a <code>while</code> loop never becomes false, the loop runs forever — this is called an infinite loop, and it\'s one of the most common early mistakes. Always make sure something inside the loop moves it toward finishing.</p>'),
    h(2, 'Looping over an array'),
    p('<p><code>for...of</code> is the simplest way to visit every item in a list.</p>'),
    code('javascript', `let fruits = ["apple", "banana", "mango"];

for (let fruit of fruits) {
  console.log(fruit);
}`),
  ]
})

lessons.push({
  slug: 'arrays', title: 'Arrays', blocks: [
    p('<p>An array is an ordered list of values, stored under a single variable name. Instead of creating <code>fruit1</code>, <code>fruit2</code>, <code>fruit3</code>, you create one array holding all of them.</p>'),
    h(2, 'Creating an array'),
    code('javascript', `let fruits = ["apple", "banana", "mango"];
console.log(fruits); // ["apple", "banana", "mango"]`),
    h(2, 'Accessing items by index'),
    p('<p>Each item has a position, called its index, starting from <strong>0</strong> — not 1.</p>'),
    code('javascript', `let fruits = ["apple", "banana", "mango"];

console.log(fruits[0]); // "apple"  — first item
console.log(fruits[1]); // "banana"
console.log(fruits[2]); // "mango"  — last item`),
    h(2, 'Common array operations'),
    table(
      ['Method', 'What it does', 'Example'],
      [
        ['<code>.push(x)</code>', 'Adds an item to the end', 'fruits.push("kiwi")'],
        ['<code>.pop()</code>', 'Removes the last item', 'fruits.pop()'],
        ['<code>.length</code>', 'Number of items', 'fruits.length → 3'],
        ['<code>.indexOf(x)</code>', 'Finds the position of a value', 'fruits.indexOf("banana") → 1'],
      ]
    ),
    code('javascript', `let fruits = ["apple", "banana"];
fruits.push("mango");

console.log(fruits.length); // 3
console.log(fruits);        // ["apple", "banana", "mango"]`),
  ]
})

lessons.push({
  slug: 'strings', title: 'Strings', blocks: [
    p('<p>A string is text — a sequence of characters wrapped in quotes. Strings are one of the most-used data types, since almost every program deals with text somewhere: names, messages, file paths, URLs.</p>'),
    h(2, 'Creating a string'),
    code('javascript', `let greeting = "Hello, world!";
let single = 'Single quotes work too';`),
    h(2, 'Joining strings'),
    code('javascript', `let first = "Ada";
let last = "Lovelace";
let fullName = first + " " + last;

console.log(fullName); // "Ada Lovelace"`),
    h(2, 'Useful string properties and methods'),
    table(
      ['Method', 'What it does', 'Example'],
      [
        ['<code>.length</code>', 'Number of characters', '"hello".length → 5'],
        ['<code>.toUpperCase()</code>', 'Converts to uppercase', '"hi".toUpperCase() → "HI"'],
        ['<code>.includes(x)</code>', 'Checks if text contains x', '"hello".includes("ell") → true'],
        ['<code>.slice(a, b)</code>', 'Extracts part of a string', '"hello".slice(0, 3) → "hel"'],
      ]
    ),
    h(2, 'Template literals'),
    p('<p>Backticks let you embed variables directly inside a string, instead of joining pieces with <code>+</code>.</p>'),
    code('javascript', `let name = "Ada";
let age = 28;

console.log(\`\${name} is \${age} years old.\`);
// "Ada is 28 years old."`),
  ]
})

lessons.push({
  slug: 'functions', title: 'Functions', blocks: [
    p('<p>A function is a named, reusable block of code that performs a task. Instead of copying the same steps everywhere you need them, you write them once as a function and call it by name whenever you need it.</p>'),
    h(2, 'Defining a function'),
    code('javascript', `function greet(name) {
  console.log("Hello, " + name + "!");
}

greet("Ada");   // "Hello, Ada!"
greet("Alan");  // "Hello, Alan!"`),
    p('<p><code>name</code> here is called a parameter — a placeholder for the value the function will receive each time it\'s called.</p>'),
    h(2, 'Returning a value'),
    p('<p>A function can hand a value back to whatever called it, using <code>return</code>.</p>'),
    code('javascript', `function add(a, b) {
  return a + b;
}

let result = add(3, 4);
console.log(result); // 7`),
    h(2, 'Why use functions'),
    p('<p>Functions make code reusable, easier to test in isolation, and easier to read — a well-named function like <code>calculateTotalPrice()</code> tells you what a block of code does without needing to read every line inside it.</p>'),
  ]
})

lessons.push({
  slug: 'recursion', title: 'Recursion', blocks: [
    p('<p>Recursion is when a function calls itself to solve a smaller version of the same problem, until it reaches a simple case it can answer directly. It\'s a different way of expressing repetition than a loop — sometimes more natural, especially for problems that are naturally defined in terms of themselves.</p>'),
    h(2, 'A classic example: factorial'),
    p('<p>The factorial of a number is that number multiplied by the factorial of the number below it, until you reach 1. For example, <code>4! = 4 × 3 × 2 × 1 = 24</code>.</p>'),
    code('javascript', `function factorial(n) {
  if (n <= 1) {
    return 1; // base case — stops the recursion
  }
  return n * factorial(n - 1); // recursive case
}

console.log(factorial(4)); // 24`),
    h(2, 'The two parts every recursive function needs'),
    table(
      ['Part', 'Purpose'],
      [['Base case', 'The simple case that returns an answer directly, with no further recursion — without this, the function calls itself forever'], ['Recursive case', 'Calls the function again on a smaller version of the problem, moving toward the base case']]
    ),
    callout('warning', '<p>A recursive function with no base case (or one that\'s never reached) causes a "stack overflow" — the program runs out of memory tracking all the pending calls. Every recursive function needs a way to eventually stop.</p>'),
  ]
})

lessons.push({
  slug: 'scope', title: 'Scope', blocks: [
    p('<p>Scope determines where in your code a variable can be accessed. A variable declared inside a function generally can\'t be seen from outside it — that\'s not a limitation, it\'s what keeps different parts of a large program from accidentally interfering with each other.</p>'),
    h(2, 'Local scope'),
    p('<p>A variable declared inside a function only exists inside that function.</p>'),
    code('javascript', `function greet() {
  let message = "Hello!";
  console.log(message); // works fine
}

greet();
console.log(message); // ❌ ReferenceError: message is not defined`),
    h(2, 'Global scope'),
    p('<p>A variable declared outside any function is accessible everywhere in the file, including inside functions.</p>'),
    code('javascript', `let siteName = "Learn Computer Academy"; // global

function printName() {
  console.log(siteName); // can read the global variable
}

printName(); // "Learn Computer Academy"`),
    h(2, 'Why scope matters'),
    p('<p>Keeping variables local (rather than making everything global) prevents different parts of a program from stepping on each other\'s variables by accident — a common source of hard-to-find bugs in larger programs.</p>'),
  ]
})

lessons.push({
  slug: 'input-output', title: 'Input and Output', blocks: [
    p('<p>Input is data a program receives — from a user, a file, or another program. Output is what the program produces in response. Almost every useful program is, at its core, a cycle of input → processing → output.</p>'),
    h(2, 'Output'),
    p('<p>In examples throughout this site, <code>console.log()</code> is used to print output — in a real webpage, output usually means updating something on the screen instead.</p>'),
    code('javascript', `console.log("This is program output.");`),
    h(2, 'Input in the browser'),
    p('<p>A simple way to accept input from a person in the browser is <code>prompt()</code>, which pops up a small input box and returns whatever the user typed, as a string.</p>'),
    code('javascript', `let name = prompt("What is your name?");
console.log("Hello, " + name + "!");`),
    callout('note', '<p><code>prompt()</code> always returns a string — if you ask for a number, remember to convert it with <code>Number()</code> before doing math with it (see the <a href="/programming/type-casting">Type Casting</a> lesson).</p>'),
    h(2, 'Real-world input/output'),
    p('<p>Beyond simple pop-ups, programs get input from web forms, files, databases, sensors, or other programs over the network — and send output to a screen, a file, a database, or across the network. The core idea is always the same: bring data in, process it, send results out.</p>'),
  ]
})

lessons.push({
  slug: 'bits-and-bytes', title: 'Bits and Bytes', blocks: [
    p('<p>Underneath every program, all data — numbers, text, images, video — is stored as sequences of just two values: 0 and 1. Understanding bits and bytes is understanding what a computer is actually doing beneath the code you write.</p>'),
    h(2, 'What is a bit?'),
    p('<p>A <strong>bit</strong> (short for "binary digit") is the smallest unit of data a computer can store — a single 0 or 1. On its own, a bit can represent exactly two states: off/on, false/true, no/yes.</p>'),
    h(2, 'What is a byte?'),
    p('<p>A <strong>byte</strong> is a group of 8 bits. One byte can represent 2⁸ = 256 different values (0 to 255) — enough to store, for example, a single letter of English text using a common encoding.</p>'),
    table(
      ['Unit', 'Size', 'Roughly'],
      [['1 byte', '8 bits', 'One character'], ['1 kilobyte (KB)', '1,024 bytes', 'A short email'], ['1 megabyte (MB)', '1,024 KB', 'A few photos'], ['1 gigabyte (GB)', '1,024 MB', 'A couple of movies']]
    ),
    h(2, 'Why this matters for programming'),
    p('<p>Data types have sizes for this exact reason — a data type that only needs to hold true/false doesn\'t need to reserve as much memory as one holding a large number. As a beginner you rarely manage bits directly, but the concept underlies everything from file sizes to network speed to why some numbers in code have limits.</p>'),
  ]
})

lessons.push({
  slug: 'binary-numbers', title: 'Binary Numbers', blocks: [
    p('<p>Binary is a number system that uses only two digits, 0 and 1 — compared to the decimal system you use every day, which has ten digits (0–9). It\'s the number system computers use internally, because a bit only has two possible states.</p>'),
    h(2, 'How binary counting works'),
    p('<p>In decimal, each position represents a power of 10 (1, 10, 100, ...). In binary, each position represents a power of 2 (1, 2, 4, 8, ...).</p>'),
    table(
      ['Binary', 'Calculation', 'Decimal'],
      [
        ['0000', '—', '0'],
        ['0001', '1', '1'],
        ['0010', '2', '2'],
        ['0011', '2 + 1', '3'],
        ['0100', '4', '4'],
        ['1010', '8 + 2', '10'],
      ]
    ),
    h(2, 'Converting binary to decimal in code'),
    code('javascript', `let decimal = parseInt("1010", 2);
console.log(decimal); // 10`),
    h(2, 'Converting decimal to binary in code'),
    code('javascript', `let binary = (10).toString(2);
console.log(binary); // "1010"`),
  ]
})

lessons.push({
  slug: 'hexadecimal-numbers', title: 'Hexadecimal Numbers', blocks: [
    p('<p>Hexadecimal ("hex" for short) is a number system with 16 digits: 0–9, then A–F standing in for 10–15. It\'s widely used in programming because it maps neatly onto binary — one hex digit represents exactly 4 bits — while being much more compact and readable than a long string of 0s and 1s.</p>'),
    h(2, 'The hex digits'),
    table(
      ['Decimal', 'Hex'],
      [['9', '9'], ['10', 'A'], ['11', 'B'], ['12', 'C'], ['13', 'D'], ['14', 'E'], ['15', 'F']]
    ),
    h(2, 'Where you\'ve already seen hex'),
    p('<p>If you\'ve worked with CSS colors, you\'ve used hexadecimal already — a color like <code>#FF8A30</code> is three hex pairs, one each for red, green, and blue (each pair ranges from <code>00</code> to <code>FF</code>, i.e. 0–255).</p>'),
    h(2, 'Converting in code'),
    code('javascript', `let decimal = parseInt("FF", 16);
console.log(decimal); // 255

let hex = (255).toString(16);
console.log(hex); // "ff"`),
  ]
})

lessons.push({
  slug: 'boolean-algebra', title: 'Boolean Algebra', blocks: [
    p('<p>Boolean algebra is the branch of logic that deals with only two values — true and false — and the operations that combine them. It\'s the mathematical foundation behind every <code>if</code> statement and logical operator you write, and behind how digital circuits themselves are built.</p>'),
    h(2, 'The three core operations'),
    table(
      ['Operation', 'JavaScript', 'Result is true when'],
      [['AND', '<code>&&</code>', 'Both inputs are true'], ['OR', '<code>||</code>', 'At least one input is true'], ['NOT', '<code>!</code>', 'The input is false (it flips the value)']]
    ),
    h(2, 'Truth tables'),
    p('<p>A truth table lists every possible combination of inputs and the result for each — a compact way to see exactly how an operation behaves.</p>'),
    table(
      ['A', 'B', 'A && B', 'A || B'],
      [['true', 'true', 'true', 'true'], ['true', 'false', 'false', 'true'], ['false', 'true', 'false', 'true'], ['false', 'false', 'false', 'false']]
    ),
    h(2, 'Why it matters'),
    p('<p>Every condition you write — <code>if (age >= 18 && hasId)</code> — is boolean algebra in action. Understanding the truth tables makes it much easier to write correct conditions, especially once you start combining several with <code>&&</code> and <code>||</code> in the same line.</p>'),
  ]
})

// ── Insert ────────────────────────────────────────────────────────────────

async function main() {
  const { data: category, error: catErr } = await supabase.from('categories').select('id').eq('slug', 'programming').single()
  if (catErr || !category) {
    console.error('Category "programming" not found — run supabase/migrations/002-i18n.sql first.')
    process.exit(1)
  }

  console.log(`Category id: ${category.id}`)
  console.log(`${lessons.length} lessons to insert\n`)

  if (DRY_RUN) {
    lessons.forEach((l, i) => console.log(`  [${i + 1}] ${l.slug} — ${l.title} (${l.blocks.length} blocks)`))
    console.log('\n[dry-run] no writes made.')
    return
  }

  let written = 0
  for (const [i, lesson] of lessons.entries()) {
    const row = {
      category_id: category.id,
      slug: lesson.slug,
      path: `programming/${lesson.slug}`,
      old_path: null,
      title: lesson.title,
      meta_title: `${lesson.title} | Learn Computer Academy`,
      meta_description: null,
      blocks: lesson.blocks,
      toc: toc(lesson.blocks),
      status: 'published',
      sort_order: i + 1,
      published_at: new Date().toISOString(),
    }
    const { error } = await supabase.from('docs').upsert(row, { onConflict: 'path' })
    if (error) { console.error(`Failed ${lesson.slug}:`, error.message); continue }
    console.log(`  ✓ ${lesson.slug}`)
    written++
  }

  console.log(`\n✅ ${written}/${lessons.length} lessons written.`)
}

main().catch(err => { console.error(err); process.exit(1) })
