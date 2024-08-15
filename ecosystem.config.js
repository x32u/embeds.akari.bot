module.exports = {
    apps: [
      {
        name: 'embeds',
        script: 'yarn',
        args: 'start',
        interpreter: 'none', // This tells PM2 not to use Node.js to run the script
      }
    ],
  };
