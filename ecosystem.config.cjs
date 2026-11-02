// pm2 config used on the VPS (see deploy/post-receive). The VPS runs other apps: this one has its own name,
// folder and port. Bound to 127.0.0.1 so it is only reachable through nginx.
module.exports = {
  apps: [
    {
      name: "pommeau-filtrant",
      script: "node_modules/next/dist/bin/next",
      args: "start -H 127.0.0.1 -p 3080",
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        // Orders and visit counts, outside the app folder so that a deploy never touches them.
        DATA_DIR: `${process.env.HOME}/pommeau-filtrant-data`,
      },
    },
  ],
};
