import { ElementGroup } from "@draw/models";
import { BaseRepository } from "./base.repository";
import Dexie, { Table } from "dexie";

export class ElementRepository extends BaseRepository<ElementGroup> {
  protected storeName = 'elementGroups';

  constructor(db: Dexie) {
    super(db);
  }

}
