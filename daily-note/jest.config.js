module.exports = {
    transform: {
        '^.+\\.[tj]sx?$': 'babel-jest', // Use Babel to transpile JS/TS files
    },
    moduleNameMapper: {
        '^axios$': require.resolve('axios'), // Ensure Jest resolves axios correctly
    },
    testEnvironment: 'jsdom', // For React testing with DOM
};
  