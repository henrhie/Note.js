<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/logo.png" height="120">
    <h1 align="center">Note.js</h1>
  </a>
</p>

<br>

## Notice⚠⚠⚠

Currently, Note.js is not supported on computers with Apple silicon and others computers with arm based architectures since Github
CI runners do not have support for these architectures. A Temporary workaround is to locate the vscode extensions folder `(~/. vscode/extensions)` on MAC OS, `%USERPROFILE%\. vscode\extensions` on Windows and `~/. vscode/extensions` on Linux, change directory into henryansah.notejs-<version number> folder, delete the node_modules folder and do an npm install.

The actually reason for this issue is that Note.js needs to be packaged for every OS and architecture separately since esbuild is written with native code and needs to install a platform-specific binary executable.

<br>

<h4>Think Jupyter notebook 📒 for Javascript. Note.js is a vscode extension that allows you to quickly prototype your frontend projects with a Jupyter-like interface in a seamless fashion.</h4>
<br>
<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/intro-img.png">
  </a>
</p>
<br></br>
Note.js introduces a new paradigm of running javascript code in your favorite editor, vscode. With support for HTML, CSS and Javascript, you can think of each cell as a module which can be imported into other cells like you would do in a traditional javascript project.
<br>
<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/import.png">
  </a>
</p>

# Features

- **Quickly visualize your beautiful HTML and CSS ideas with vscode's built in webview**
- **Fast code bundling ⚡⚡⚡** - Under the hood, Note.js uses Esbuild, a blazing fast rust based bundler and transpiler to bundle your different local and remote modules together
- **Use your favourite NPM packages 🛰🛰🛰** - Using custom esbuild plugins, add your favourite npm package to your experiments is just as easy as importing it into your code cell.
- **Supports caching** - Fetch your npm packages only once per session with built in support for caching remote packages.
- **First class support for React.js** - With esbuild's built-in support for JSX transpilation, experimenting with your React ideas has never been easier. [Check out how to experiment with React ideas in Note.js](#react)

# Getting Started

To get started with Note.js, create a new file and name it with the extension, **_.jsbook_**. This will automatically activate your Note.js extension for you to begin your work.
<br>
Note.js consists of two panels - The notebook panel where you write your code and documentation and a Webview panel which is responsible for displaying your html and executing your javascript code.

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

And don't worry about fetching packages on every execution - every package that is fetched is cached in memory.

### Html

The default supported language for a cell is javascript. You can change it by clicking the language shown at the button right corner and selecting the prefered language from the pop-up menu. To name an html cell, just comment it out at the top of the cell
Eg. `html <!-- index.html --> `
And begin writing your html. Note that you do not need to write any boilerplate html code - just hit the ground running with your ideas.

## React

Note.js has first class support for React.js. As in a normal react project, you just need some html and javascript code.

<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/react-1-doc.png">
  </a>
</p>

## Css

Add css code is just as simple as add html and javascript to your prototype. Comment out the name of your css cell **_without .css_** and import it into your javascript code.

<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/css-1-doc.png">
  </a>
</p>

⚠️⚠️⚠️ Take note that even if you are writing just html and css without javascript code, you need to import your css module into a javascript cell and run that javascript cell for your css to take effect.

<p align="center">
    <img src="https://raw.githubusercontent.com/henrhie/jsbook/master/.github/css-2-doc.png">
  </a>
</p>

## Markdown 📒

Note.js supports Markdown for you to document your code and share insights with others 🥰.

Should you close you webview whether accidental or intentional, you can bring it back up by opening the command palette and enter the command `show webview`.

## Acknowledgement

Some ideas leading to this project was based on [Stephen Grider's React and Typescript: Build a portfolio course](https://www.udemy.com/course/react-and-typescript-build-a-portfolio-project) on Udemy

## License

[MIT](https://choosealicense.com/licenses/mit/)
