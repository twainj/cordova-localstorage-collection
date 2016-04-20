declare class LsCollection<T> implements EventListenerObject {
    constructor(id: string);
    Dispose(): void;
    private _col;
    private _lsId;
    LsId: string;
    private _hashFunc;
    HashFunc: (T) => string;
    /**
     * Check if an item with the same hash exists
     * @param itemOrKey - item to test for existence, or its key
     * @returns {boolean} - true if found, otherwise false
     */
    Exists(itemOrKey: string | T): boolean;
    /**
     * Add an item to the collection if there is no item with the same hash
     * @param item - item to add
     * @returns {boolean} - true if successful (no item with same hash), false otherwise
     */
    Add(item: T): boolean;
    /**
     * Update an item in the collection based on the item hash
     * @param item - value to update the item with
     * @constructor
     */
    Update(item: T): boolean;
    /**
     * Remove an item from the
     * @param itemOrKey - the item to remove, or its key
     * @returns {T} - the item that was removed
     */
    Remove(itemOrKey: string | T): T;
    Get(key: string): T;
    ForEach: (callbackfn: (value: T, index: string) => void) => void;
    Entries: T[];
    private serialize();
    private deserialize(json);
    private getIndex(itemOrKey);
    private arrayFind(arr, predicate);
    handleEvent(ev: Event): void;
    private onAppPause();
    private onAppResume();
}
declare module 'cordova-localstorage-collection' {
    export = LsCollection;
}
