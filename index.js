var LsCollection = (function () {
    function LsCollection(id) {
        var _this = this;
        // Map Passthru
        this.ForEach = function (callbackfn) {
            for (var key in _this._col) {
                callbackfn(_this._col[key], key);
            }
        };
        this._lsId = id;
        this._col = {};
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
    // Add and update are identical at this time.
    LsCollection.prototype.Add = function (item) {
        this.Update(item);
    };
    // Add and update are identical at this time.
    LsCollection.prototype.Update = function (item) {
        var id = this._hashFunc(item);
        this._col[id] = item;
    };
    LsCollection.prototype.Remove = function (id) {
        var ret = this._col[id];
        delete this._col[id];
        return ret;
    };
    LsCollection.prototype.Get = function (id) {
        return this._col[id];
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
        return JSON.parse(json);
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
        this._col = this.deserialize(localStorage.getItem(this.LsId));
    };
    return LsCollection;
}());
