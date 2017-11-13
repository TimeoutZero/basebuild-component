module.exports = {
  "target": "node",
  "module": {
    "rules": [
      {
        "test": /\.(ts|tsx)$/,
        "exclude": /\.(ts|tsx)$/,
        "use": {
          "loader": "ts-loader",
          "options": {
            "configFile": "c:\\Users\\carlos.silva\\Documents\\workspace\\basebuild-component\\tsconfig.json"
          }
        }
      },
      {
        "test": /\.(ts|tsx)$/,
        "exclude": /\.(ts|tsx)$/
      },
      {
        "test": /\.(ts|tsx)$/,
        "exclude": /\.(ts|tsx)$/,
        "loader": "coffee-loader"
      }
    ]
  },
  "resolve": {
    "extensions": [
      ".ts",
      ".tsx",
      ".js",
      ".jsx",
      ".coffee"
    ],
    "modules": [
      "c:\\Users\\carlos.silva\\Documents\\workspace\\basebuild-component\\node_modules",
      "node_modules"
    ]
  }
};