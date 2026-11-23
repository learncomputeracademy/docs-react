// Snippets typed out by the homepage code window (components/magic/animated-code.tsx).
// Shared so the server can highlight them (lib/shiki.ts tokenize) and the
// client only types them out.
export const SNIPPETS = [
  {
    lang: 'css',
    filename: 'style.css',
    code: `.center {
  margin: auto;
  width: 60%;
  border: 3px solid orange;
  padding: 10px;
}`,
  },
  {
    lang: 'html',
    filename: 'index.html',
    code: `<!DOCTYPE html>
<html lang="en">
  <body>
    <h1>Hello, world!</h1>
    <p>Learn to build for the web.</p>
  </body>
</html>`,
  },
  {
    lang: 'javascript',
    filename: 'script.js',
    code: `function greet(name) {
  return \`Hello, \${name}!\`
}

document
  .querySelector('#btn')
  .addEventListener('click', () => {
    console.log(greet('world'))
  })`,
  },
  {
    lang: 'jsx',
    filename: 'App.jsx',
    code: `function App() {
  const [count, setCount] = useState(0)

  return (
    <button onClick={() => setCount(count + 1)}>
      Clicked {count} times
    </button>
  )
}`,
  },
  {
    lang: 'php',
    filename: 'index.php',
    code: `<?php
  $name = "world";
  echo "Hello, " . $name . "!";
?>`,
  },
  {
    lang: 'python',
    filename: 'app.py',
    code: `def greet(name):
    return f"Hello, {name}!"

for student in ["Amit", "Priya"]:
    print(greet(student))`,
  },
  {
    lang: 'sql',
    filename: 'query.sql',
    code: `SELECT title, category
FROM lessons
WHERE published = TRUE
ORDER BY created_at DESC
LIMIT 5;`,
  },
] as const
