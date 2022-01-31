import * as vscode from 'vscode';

export const html = (htmlContent: string = '', scriptSrc: vscode.Uri) => `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8"/>
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body {background-color: white;}
        .vscode-light { color: black }
        .vscode-dark { color: black }
        .vscode-high-contrast { color: black }
      </style>
    </head>
    <body>
     ${htmlContent}
     <script src=${scriptSrc}
			)}></script>
    </body>
    </html>
  `;
