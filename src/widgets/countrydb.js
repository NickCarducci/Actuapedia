import PouchDB from "pouchdb";
import upsert from "pouchdb-upsert";

export default class CDB {
  constructor(name) {
    PouchDB.plugin(upsert);
    this.db = new PouchDB("meCountry", {
      revs_limit: 1,
      auto_compaction: true
    });
  }
  async readCountry() {
    let allInfo = await this.db
      .allDocs({ include_docs: true })
      .catch((err) => console.log(err.message));
    let notes = {};
    allInfo && allInfo.rows.forEach((n) => (notes[n.doc._id] = n.doc));

    return notes;
  }

  async setCountry(c) {
    if (!c._id) {
      window.alert("pouchdb needs ._id key:value");
      this.db.destroy();
    } else {
      var res = await this.db.upsert(c._id, (doc) => {
        doc = { ...c };
        return doc;
      });
      return res;
    }
  }

  deleteKeys() {
    this.db.destroy();
  }
}
