declare class LsCollection<T> implements EventListenerObject {
    constructor(id: string);
    Dispose(): void;
    private _col;
    private _lsId;
    LsId: string;
    private _hashFunc;
    HashFunc: (T) => string;
    Add(item: T): void;
    Update(item: T): void;
    Remove(id: string): T;
    Get(id: string): T;
    ForEach: (callbackfn: (value: T, index: string) => void) => void;
    Entries: Object;
    private serialize();
    private deserialize(json);
    handleEvent(ev: Event): void;
    private onAppPause();
    private onAppResume();
}
declare module 'cordova-localstorage-collection' {
    export = LsCollection;
}
