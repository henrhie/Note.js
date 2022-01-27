"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const NodeCache = require("node-cache");
class Cache {
    constructor() {
        this.mapPathToVersionName = (path) => {
            const _data_ = [];
            const splitData = path.split('');
            for (let i = 0; i < splitData.length; i++) {
                if (i === 0) {
                    continue;
                }
                if (splitData[i] === '/') {
                    break;
                }
                _data_.push(splitData[i]);
            }
            return _data_.join('');
        };
        this.mapVersionNameTofilename = (versionName) => {
            const _data_ = [];
            const splitData = versionName.split('');
            for (let i = 0; i < splitData.length; i++) {
                if (splitData[i] === '@') {
                    break;
                }
                _data_.push(splitData[i]);
            }
            return _data_.join('');
        };
        this.cache = new NodeCache({ useClones: false });
    }
    setModuleData(moduleContent, path) {
        const versionName = this.mapPathToVersionName(path);
        this.cache.set(versionName, moduleContent);
        this.setModuleVersion(versionName);
    }
    getModuleData(filename) {
        const versionName = this.getModuleVersion(filename);
        if (!versionName) {
            return;
        }
        return this.cache.get(versionName);
    }
    setModuleVersion(versionName) {
        const filename = this.mapVersionNameTofilename(versionName);
        this.cache.set(filename, versionName);
    }
    getModuleVersion(filename) {
        return this.cache.get(filename);
    }
}
const cache = new Cache();
exports.cache = cache;
//# sourceMappingURL=cache.js.map