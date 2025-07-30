import { ElementSubgroup } from "@draw/models";
import { BaseRepository } from "./base.repository";
import Dexie, { Table } from "dexie";

export class ElementSubGroupRepository extends BaseRepository<ElementSubgroup> {
  protected storeName = 'elementSubgroups';

  constructor(db: Dexie) {
    super(db);
  }
}
