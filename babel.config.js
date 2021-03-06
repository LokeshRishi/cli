module.exports = {
  presets: [
    [
      "@babel/env",
      {
        loose: true,
        targets: {
          node: "8"
        }
      }
    ]
  ],
  plugins: [
    "@babel/transform-runtime",
    "@babel/proposal-class-properties",
    "@babel/proposal-object-rest-spread"
  ]
};
