module.exports.schema = `
type Query {
    hello: String
}
`;

module.exports.resolver = {
    hello: () => {
        return "Hello World!";
    }
};