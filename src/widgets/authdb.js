import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";

export default class ADB {
  constructor(name) {
    PouchDB.plugin(upsert);
    this.db = new PouchDB("meAuth", { revs_limit: 1, auto_compaction: true });
  }
  async readAuth() {
    let allInfo = await this.db.allDocs({ include_docs: true });
    let notes = {};
    allInfo && allInfo.rows.forEach((n) => (notes[n.doc._id] = n.doc));

    return notes;
  }

  async setAuth(meAuth) {
    if (meAuth._id === "none") {
      this.db.destroy();
    } else if (!meAuth._id) {
      window.alert("pouchdb needs ._id key:value");
      this.db.destroy();
    } else {
      var res = await this.db.upsert(meAuth._id, (doc) => {
        doc = { ...meAuth };
        return doc;
      });
      return res;
    }
  }

  deleteKeys() {
    this.db.destroy();
  }
}
