module.exports = {
    "extends": "standard",
    "rules": {
        "standard/object-curly-even-spacing": "off",
        "valid-jsdoc": "error",
        "object-curly-spacing": ["error" ,"always"],
        "require-jsdoc": ["error", {
            "require": {
                "FunctionDeclaration": true,
                "ArrowFunctionExpression": true,
                "FunctionExpression": true,
                "MethodDefinition": true,
                "ClassDeclaration": true
            }
        }]
    },
};