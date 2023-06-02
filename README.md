
This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

  

## Getting Started  

1. Install Node [LTS v18.16.0](https://nodejs.org/en/download)
2. Using VSCode, install the extensions [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) and [Eslint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint). The lint-on-save is already configured inside .vscode folder.
3. Install [pnpm](https://pnpm.io/pt/installation)
4. Using _pnpm_, run pnpm install to install all dependencies
5. Create a new file _.env.local_ and insert your google API key
	- You can follow the example from .env.local.example
6. Using _pnpm_ you can now start a development server with the following command: `pnpm dev`

Now you are ready to open [http://localhost:3000](http://localhost:3000) in your browser to see the homepage screen.  

# Detailed application features:  
<details>
  ## Search and add new location by address:  
  
  ![image](https://github.com/nekitbr/teste_react_syonet/assets/69054878/c8225eb7-a1e1-4687-b810-2c657708a860)

  ## Search and add new location by latitude/longitude  
  First, click on the mode selector, so you can change from address search to lat/lng search:  
  ![image](https://github.com/nekitbr/teste_react_syonet/assets/69054878/033ef2d8-b836-4570-9d0c-67f17ea25de6)

  Then, the search will happen and the workflow follows the same path as with the address  
  ![image](https://github.com/nekitbr/teste_react_syonet/assets/69054878/9fbd6345-3f81-4e07-916e-93180cd69ce7)

  ## Change saved location details  
  You can open the edit marker modal by clicking on it's icon OR by double clicking on it's card  
  ![image](https://github.com/nekitbr/teste_react_syonet/assets/69054878/753f96cb-fb86-44df-8d0b-5a32aed9a47c)

  After making your changes, you can save and see this reflecting on the left panel and inside the Map  
  ![image](https://github.com/nekitbr/teste_react_syonet/assets/69054878/9bb7f3b0-c167-4cdb-a556-af7e40a73188)

  Case: edited card selecting custom icon color  
  ![image](https://github.com/nekitbr/teste_react_syonet/assets/69054878/492e4b7b-e323-4948-8cd4-f498ad779039)

  Case: edited card selecting custom url icon (notice how the map marker also changes)  
  ![image](https://github.com/nekitbr/teste_react_syonet/assets/69054878/34a55856-10b9-429e-be27-cd32b812a1cd)
</details>
