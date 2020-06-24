import { FirestoreConnection } from './FirestoreConnection'
import {
    ReactivePromise,
    StatefulStream,
} from '@typeheim/fire-rx'
import { OrmOnFire } from '../singletons'
// Firestore types
import * as types from '@firebase/firestore-types'
import DocumentReference = types.DocumentReference
import DocumentSnapshot = types.DocumentSnapshot

export class DocReference {
    protected _nativeRef: DocumentReference

    constructor(protected connection: FirestoreConnection, protected docPath?: string, protected collectionPath?: string) {}

    static fromNativeRef(docRef: DocumentReference) {
        let doc = new DocReference(OrmOnFire)
        doc._nativeRef = docRef

        return doc
    }

    get(): StatefulStream<DocumentSnapshot> {
        let subject = new StatefulStream<DocumentSnapshot>()
        this.connection.isInitialized.then((isInitialized: boolean) => {
            if (isInitialized) {
                this.nativeRef.get().then((snapshot: DocumentSnapshot) => {
                    subject.next(snapshot)
                    subject.complete()
                })
            }
        }).catch(error => subject.error(error))

        return subject
    }

    set(data): ReactivePromise<boolean> {
        let promise = new ReactivePromise<boolean>()
        this.connection.isInitialized.then((isInitialized: boolean) => {
            if (isInitialized) {
                this.nativeRef.set(data).then(() => {
                    promise.resolve()
                })
            }
        }).catch(error => promise.reject(error))

        return promise
    }

    update(data): ReactivePromise<boolean> {
        let promise = new ReactivePromise<boolean>()
        this.connection.isInitialized.then((isInitialized: boolean) => {
            if (isInitialized) {
                this.nativeRef.update(data).then(() => {
                    promise.resolve(true)
                })
            }
        }).catch(error => promise.reject(error))

        return promise
    }

    delete(): ReactivePromise<boolean> {
        let promise = new ReactivePromise<boolean>()
        this.connection.isInitialized.then((isInitialized: boolean) => {
            if (isInitialized) {
                this.nativeRef.delete().then(() => {
                    promise.resolve(true)
                })
            }
        }).catch(error => promise.reject(error))

        return promise
    }

    snapshot(): StatefulStream<DocumentSnapshot> {
        let subject = new StatefulStream<DocumentSnapshot>()
        this.connection.isInitialized.then((isInitialized: boolean) => {
            if (isInitialized) {
                this.nativeRef.onSnapshot((snapshot: DocumentSnapshot) => {
                    subject.next(snapshot)
                })
            }
        }).catch(error => subject.error(error))

        return subject
    }

    get nativeRef() {
        if (!this._nativeRef) {
            let baseRef = this.collectionPath ? this.connection.driver.collection(this.collectionPath) : this.connection.driver
            // @ts-ignore
            this._nativeRef = this.docPath ? baseRef.doc(this.docPath) : baseRef.doc()
        }
        return this._nativeRef
    }
}
