CHAMPIONS 2016 HANDALL DASHBOARD - CLEAN REBUILD

1. Upload every file in this ZIP together to the same web-hosting folder.
2. The dashboard reads live data from the published Google Sheets CSV URL configured near the start of index.html in SETTINGS.googleSheetCsv.
3. To use another Google Drive spreadsheet, publish the required sheet as CSV and replace SETTINGS.googleSheetCsv.
4. Google Drive file preview does not host web apps. Use a static host such as Tiiny Host, GitHub Pages, Netlify, Cloudflare Pages, or Firebase Hosting. Google Sheets can remain the live data source.
5. If an older PWA is installed, uninstall it and clear the previous site data before reinstalling this rebuild.
6. The scoreboard is now native in index.html, not embedded in an iframe. Fullscreen is requested directly on the scoreboard element.
