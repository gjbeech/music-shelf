import mongoose, { Model } from "mongoose";

const { DATABASE_URL } = process.env;

export const connect = async () => {
  const connection = await mongoose
    .connect(DATABASE_URL as string)
    .catch((err) => console.log(err));
  console.log("Mongoose Connection Established");

  const ListSchema = new mongoose.Schema({
    title: String,
    type: String,
  });

  const FolderSchema = new mongoose.Schema({
    name: String,
  });

  const FileSchema = new mongoose.Schema({
    name: String,
    folderid: String,
  });

  const ListItemSchema = new mongoose.Schema({
    item: String,
    listId: String,
  });

  const TagSchema = new mongoose.Schema({
    name: String,
    colour: String,
  });

  const List = mongoose.models.List || mongoose.model("List", ListSchema);

  const ListItem =
    mongoose.models.ListItem || mongoose.model("ListItem", ListItemSchema);

  const Tag = mongoose.models.Tag || mongoose.model("Tag", TagSchema);

  const Folder =
    mongoose.models.Folder || mongoose.model("Folder", FolderSchema);

  const File = mongoose.models.File || mongoose.model("File", FileSchema);

  return { connection, ListItem, Tag, List, Folder, File };
};
