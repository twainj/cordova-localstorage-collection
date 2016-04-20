var LsCollection = (function () {
    function LsCollection(id) {
        var _this = this;
        // Map Passthru
        this.ForEach = function (callbackfn) {
            for (var i in _this._col) {
                var key = _this._hashFunc(_this._col[i]);
                callbackfn(_this._col[i], key);
            }
        };
        this._lsId = id;
        this._col = [];
        document.addEventListener('pause', this);
        document.addEventListener('resume', this);
    }
    LsCollection.prototype.Dispose = function () {
        document.removeEventListener('pause', this);
        document.removeEventListener('resume', this);
    };
    Object.defineProperty(LsCollection.prototype, "LsId", {
        get: function () { return this._lsId; },
        set: function (value) { this._lsId = value; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LsCollection.prototype, "HashFunc", {
        set: function (value) { this._hashFunc = value; },
        enumerable: true,
        configurable: true
    });
    /**
     * Check if an item with the same hash exists
     * @param itemOrKey - item to test for existence, or its key
     * @returns {boolean} - true if found, otherwise false
     */
    LsCollection.prototype.Exists = function (itemOrKey) {
        return this.getIndex(itemOrKey) != -1;
    };
    /**
     * Add an item to the collection if there is no item with the same hash
     * @param item - item to add
     * @returns {boolean} - true if successful (no item with same hash), false otherwise
     */
    LsCollection.prototype.Add = function (item) {
        var i = this.getIndex(item);
        if (i != -1) {
            this.Update(item);
            return true;
        }
        else
            return false;
    };
    /**
     * Update an item in the collection based on the item hash
     * @param item - value to update the item with
     * @constructor
     */
    LsCollection.prototype.Update = function (item) {
        var i = this.getIndex(item);
        if (i != -1) {
            this._col.splice(i, 1, item);
            return true;
        }
        else
            return false;
    };
    /**
     * Remove an item from the
     * @param itemOrKey - the item to remove, or its key
     * @returns {T} - the item that was removed
     */
    LsCollection.prototype.Remove = function (itemOrKey) {
        var i = this.getIndex(itemOrKey);
        var ret = this._col[i];
        this._col.splice(i, 1);
        return ret;
    };
    LsCollection.prototype.Get = function (key) {
        var i = this.getIndex(key);
        return this._col[i];
    };
    Object.defineProperty(LsCollection.prototype, "Entries", {
        get: function () { return this._col; },
        enumerable: true,
        configurable: true
    });
    //// Private functions
    LsCollection.prototype.serialize = function () {
        return JSON.stringify(this._col);
    };
    LsCollection.prototype.deserialize = function (json) {
        var arr = JSON.parse(json);
        if (Array.isArray(arr)) {
            this._col = arr;
        }
        else {
            throw "Attempted to deserialize an incompatible JSON string to LsCollection.";
        }
    };
    LsCollection.prototype.getIndex = function (itemOrKey) {
        var _this = this;
        var hash = typeof (itemOrKey) === 'string' ? itemOrKey : this._hashFunc(itemOrKey);
        var idExisting = null;
        var existing = this.arrayFind(this._col, function (i, el) {
            if (_this._hashFunc(el) == hash) {
                idExisting = i;
                return true;
            }
            else
                return false;
        });
        if (existing !== undefined) {
            return idExisting;
        }
        else
            return -1;
    };
    // A polyfill of the ES6 Array.find method.
    LsCollection.prototype.arrayFind = function (arr, predicate) {
        var list = Object(arr);
        var length = list.length >>> 0;
        var thisArg = arguments[1];
        var value;
        for (var i = 0; i < length; i++) {
            value = list[i];
            if (predicate.call(thisArg, value, i, list)) {
                return value;
            }
        }
        return undefined;
    };
    /// Event Handlers
    LsCollection.prototype.handleEvent = function (ev) {
        switch (ev.type) {
            case 'pause':
                this.onAppPause();
                break;
            case 'resume':
                this.onAppResume();
                break;
        }
    };
    LsCollection.prototype.onAppPause = function () {
        localStorage.setItem(this.LsId, this.serialize());
    };
    LsCollection.prototype.onAppResume = function () {
        this.deserialize(localStorage.getItem(this.LsId));
    };
    return LsCollection;
}());
