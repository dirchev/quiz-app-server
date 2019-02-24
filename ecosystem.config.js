module.exports = {
  apps: [{
    name: "main",
    script: "index.js",
    merge_logs: true
  }],
  deploy: {
    // VMWARE local machine
    staging: {
      // SSH key path, default to $HOME/.ssh
      key: "$HOME/.ssh",
      // SSH user
      user: "dirchev",
      // SSH host
      host: ["quiz-app.loc"],
      // ssh_options: "StrictHostKeyChecking=no",
      ref: "origin/master",
      // GIT remote
      repo: "git@github.com:dirchev/quiz-app-server.git",
      // path in the server
      path: "/home/dirchev/quiz-app-server",
      // Pre-setup command or path to a script on your local machine
      "pre-setup": "apt-get install git ; ls -la",
      // Post-setup commands or path to a script on the host machine
      // eg: placing configurations in the shared dir etc
      "post-setup": "ls -la",
      // pre-deploy action
      "pre-deploy-local": "echo 'This is a local executed command'",
      // post-deploy action
      "post-deploy": "npm install && pm2 startOrRestart ecosystem.config.js --env staging",
    },
  }
}
