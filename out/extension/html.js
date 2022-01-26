"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.html = void 0;
exports.html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Code Sandbox</title>
      <style>
        body {background-color: white;}
        .vscode-light { color: black }
        .vscode-dark { color: black }
        .vscode-high-contrast { color: black }
      </style>
    </head>
    <body>
     <div id="root"></div> 
     <script>
     const vscode = acquireVsCodeApi();
      // General Error Handling Function
      const handleError = err => {
        const root = document.getElementById('root');
        root.innerHTML = '<div style="color: red;"><h4>Runtime Error</h4>' + err + '</div>';
        console.error(err);
      }
      // Error handler for Async Code
      window.addEventListener("error", (e) => {
        e.preventDefault();
        handleError(e.error);
      });
      console.stdlog = console.log.bind(console);
      console.logs = [];
      console.log = function(){
        console.logs.push(Array.from(arguments));
        console.stdlog.apply(console, arguments);
      }
      window.addEventListener("message", (event) => {
        try {
          const output = eval(event.data);
          vscode.postMessage({
              output: console.logs,
          })
          console.logs = []
        } catch (err) {
          handleError(err);
        }
      }, false);
     </script>
    </body>
    </html>
  `;
//# sourceMappingURL=html.js.map