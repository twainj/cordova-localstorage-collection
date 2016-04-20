
class LsCollection<T> implements EventListenerObject {
    constructor(id: string) {
        this._lsId = id;
        this._col = [];

        document.addEventListener('pause', this);
        document.addEventListener('resume', this);
    }
    public Dispose() {
        document.removeEventListener('pause', this);
        document.removeEventListener('resume', this);
    }

    private _col: Array<T>;

    private _lsId: string;
    public get LsId() { return this._lsId; }
    public set LsId(value: string) { this._lsId = value; }

    private _hashFunc: (T) => string;
    public set HashFunc(value: (T) => string) { this._hashFunc = value; }

    /**
     * Check if an item with the same hash exists
     * @param itemOrKey - item to test for existence, or its key
     * @returns {boolean} - true if found, otherwise false
     */
    public Exists(itemOrKey: string | T): boolean {
        return this.getIndex(itemOrKey) != -1;
    }

    /**
     * Add an item to the collection if there is no item with the same hash
     * @param item - item to add
     * @returns {boolean} - true if successful (no item with same hash), false otherwise
     */
    public Add(item: T): boolean {
        var i = this.getIndex(item);
        if(i != -1) {
            this.Update(item);
            return true;
        }
        else return false;
    }

    /**
     * Update an item in the collection based on the item hash
     * @param item - value to update the item with
     * @constructor
     */
    public Update(item: T): boolean {
        var i = this.getIndex(item);
        if(i != -1) {
            this._col.splice(i, 1, item);
            return true;
        }
        else return false;
    }

    /**
     * Remove an item from the
     * @param itemOrKey - the item to remove, or its key
     * @returns {T} - the item that was removed
     */
    public Remove(itemOrKey: string | T): T {
        var i = this.getIndex(itemOrKey);
        var ret = this._col[i];
        this._col.splice(i, 1);

        return ret;
    }

    public Get(key: string): T {
        var i = this.getIndex(key);
        return this._col[i];
    }

    // Map Passthru
    public ForEach = (callbackfn: (value: T, index: string) => void) => {
        for(var i in this._col) {
            var key = this._hashFunc(this._col[i]);
            callbackfn(this._col[i], key);
        }
    };
    public get Entries() { return this._col; }

    //// Private functions
    private serialize(): string {
        return JSON.stringify(this._col);
    }
    private deserialize(json: string): void {
        var arr = JSON.parse(json);
        if(Array.isArray(arr)) {
            this._col = arr;
        } else {
            throw "Attempted to deserialize an incompatible JSON string to LsCollection.";
        }
    }
    private getIndex(itemOrKey: string | T): number {
        var hash = typeof(itemOrKey) === 'string' ? itemOrKey : this._hashFunc(itemOrKey);
        var idExisting = null;
        var existing = this.arrayFind(this._col, (i, el) => {
            if(this._hashFunc(el) == hash) {
                idExisting = i;
                return true;
            }
            else return false;
        });
        if(existing !== undefined) {
            return idExisting;
        }
        else return -1;
    }
    // A polyfill of the ES6 Array.find method.
    private arrayFind(arr: Array<T>, predicate: (i: number, el: T, arr: Array<T>) => boolean) {
        var list:any = Object(arr);
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
    }

    /// Event Handlers
    public handleEvent(ev: Event) {
        switch(ev.type) {
            case 'pause': this.onAppPause();break;
            case 'resume': this.onAppResume();break;
        }
    }

    private onAppPause() {
        localStorage.setItem(this.LsId, this.serialize());
    }
    private onAppResume() {
        this.deserialize(localStorage.getItem(this.LsId));
    }

}

declare module 'cordova-localstorage-collection' {
    export = LsCollection;
}