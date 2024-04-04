export interface ResponseFuncs {
  GET?: Function;
  POST?: Function;
  PUT?: Function;
  DELETE?: Function;
  OPTIONS?: Function;
}

export interface ListItem {
  _id?: number;
  item: string;
  listId: string;
}

export interface List {
  _id?: number;
  title: string;
  type: string;
  // created: Date;
}

export interface Tag {
  _id?: number;
  name: string;
  colour: string;
}

export interface Folder {
  _id?: number;
  name: string;
}

export interface File {
  _id?: number;
  name: string;
  folderid: number;
}
