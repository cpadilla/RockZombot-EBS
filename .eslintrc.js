module.exports = {
    //root: true,
    env: {
        node: true,
        mocha: true
    },
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    extends: 'standard',
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    rules: {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await 
        'generator-star-spacing': 0,
        'space-before-function-paren': ['error', {
            'anonymous': 'never',
            'named': 'never',
            'asyncArrow': 'always'
        }],
        'indent': ['error', 4],
        'comma-dangle': ['error', {
            'arrays': 'ignore',
            'objects': 'never',
            'imports': 'never',
            'exports': 'never',
            'functions': 'ignore'
        }],
        'no-unused-expressions': 'off'
    },
    globals: {
        'expect': true,
        'config': true,
        'user': true,
        'sinon': true,
        'request': true
    }
};
