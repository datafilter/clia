module.exports = [{
    files: ["**/*.js"],
    rules: {
        "no-unused-vars": ["error",{ "argsIgnorePattern" : "^_", "varsIgnorePattern" : "^_" }],
        "prefer-const" : "error"
    }         
}]
