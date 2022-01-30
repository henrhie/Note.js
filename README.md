<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/logo.png" height="120">
    <h1 align="center">Note.js</h1>
  </a>
</p>

<h4>Think Jupyter notebook 📒 for Javascript. Note.js is a vscode extension that allows you to quickly prototype your frontend projects with a Jupyter-like interface in a seamless fashion.</h4>
<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/intro-img.png">
  </a>
</p>

Note.js introduces a new paradigm of running javascript code in your favorite editor, vscode. With support for HTML, CSS and Javascript, you can think of each cell as a module which can be imported into other cells like you would do in a traditional javascript project.

<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/import.png">
  </a>
</p>

# Features

-

# Docs

## Javascript

Running Javascript in Note.js is just as simple as click the run button next to a cell. ⚠️⚠️⚠️ Note.js does not run code cumulatively as it is in Jupyter Notebook. The code cell that is run is treated as the entry code and any code in any cell that is needed can be imported. The convention to name cells as javascript modules is:

```javascript
//<module-name>// ⚠️ without .js at the top of the cell

//...rest of code
```

<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/javascript-1-doc.png">
  </a>
</p>

You probably might be wondering how you are going to use your favourite npm modules like React and Lodash. Well you don't need to worry about npm or node_modules - Just import them as you would in your javascript project. Under the hood, Note.js uses custom esbuild plugins to fetch source code of npm packages from https://unpkg.com and bundles everything together.

<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/javascript-2-doc.png">
  </a>
</p>

