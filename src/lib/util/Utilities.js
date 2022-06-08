class Utilities {
    constructor() {
        throw new Error("This class cannot be instantiated.");
    }

    static validate(against = [], object) {
        object.__missing = [];

        for (const key of against) {
            if (!object[key])
                object.__missing.push(key);
        }

        return object.__missing.length === 0;
    }
}

module.exports = Utilities;