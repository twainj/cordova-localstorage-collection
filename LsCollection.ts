
export default class LsCollection<T> {
    constructor(id: string) {
        this._lsId = id;
        this._col = {};

        document.addEventListener('pause', this);
        document.addEventListener('resume', this);
    }
    public Dispose() {
        document.removeEventListener('pause', this);
        document.removeEventListener('resume', this);
    }

    private _col: Object;

    private _lsId: string;
    public get LsId() { return this._lsId; }
    public set LsId(value: string) { this._lsId = value; }

    private _hashFunc: (T) => string;
    public set HashFunc(value: (T) => string) { this._hashFunc = value; }

    // Add and update are identical at this time.
    public Add(item: T): void {
        this.Update(item);
    }

    // Add and update are identical at this time.
    public Update(item: T): void {
        var id = this._hashFunc(item);
        this._col[id] = item;
    }

    public Remove(id: string): T {
        var ret = this._col[id];
        delete this._col[id];

        return ret;
    }

    public Get(id: string): T {
        return this._col[id];
    }

    // Map Passthru
    public ForEach = (callbackfn: (value: T, index: string) => void) => {
        for(var key in this._col) {
            callbackfn(this._col[key], key);
        }
    };
    public get Entries() { return this._col; }

    //// Private functions
    private serialize(): string {
        return JSON.stringify(this._col);
    }
    private deserialize(json: string): Object {
        return JSON.parse(json);
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
        this._col = this.deserialize(localStorage.getItem(this.LsId));
    }

}

