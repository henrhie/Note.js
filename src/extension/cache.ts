import NodeCache = require('node-cache');

class Cache {
	constructor() {
		this.cache = new NodeCache({ useClones: false });
	}

	setModuleData(moduleContent: string, path: string) {
		const versionName = this.mapPathToVersionName(path);
		this.cache.set(versionName, moduleContent);
		this.setModuleVersion(versionName);
	}

	getModuleData(filename: string) {
		const versionName = this.getModuleVersion(filename);
		if (!versionName) {
			return;
		}
		return this.cache.get<string>(versionName);
	}

	setModuleVersion(versionName: string) {
		const filename = this.mapVersionNameTofilename(versionName);
		this.cache.set<string>(filename, versionName);
	}

	getModuleVersion(filename: string) {
		return this.cache.get<string>(filename);
	}

	mapPathToVersionName = (path: string) => {
		const _data_ = [];
		for (let i = 0; i < path.length; i++) {
			if (i === 0) {
				continue;
			}
			if (path[i] === '/') {
				break;
			}
			_data_.push(path[i]);
		}
		return _data_.join('');
	};

	mapVersionNameTofilename = (versionName: string) => {
		const _data_ = [];
		for (let i = 0; i < versionName.length; i++) {
			if (versionName[i] === '@') {
				break;
			}
			_data_.push(versionName[i]);
		}
		return _data_.join('');
	};

	cache: NodeCache;
}

const cache = new Cache();
export { cache };
