//import mongoose from "mongoose";
import Nav from "../components/Nav";
const { DATABASE_URL } = process.env;
import { connect } from "../utils/connection";
import { scan } from "../utils/scan";
export default function WishList() {
  console.dir("scan for media page");

  return (
    <div>
      <main>
        <Nav />
        <label htmlFor="name">Folder to scan:</label>
        <input title="Folder" name="folder"></input>
        <button title="Scan Folder" onClick={test}>
          Scan folder
        </button>
        <ul></ul>
      </main>
    </div>
  );
}
async function test() {
  //const mongoose = require("mongoose");
  //mongoose.connect(DATABASE_URL);

  var Db = require("mongodb").Db,
    // MongoClient = require("mongodb").MongoClient,
    Server = require("mongodb").Server;

  var db = new Db(
    "music-shelf",
    new Server("gjbeech:id84xt90@cluster0.cs5lk.mongodb.net", 27017, {
      auto_reconnect: true,
    }),
    { w: 1 }
  );
  //scan();

  //   MongoClient.connect(DATABASE_URL, function (err, db) {
  //     if (err) throw err;
  //     var dbo = db.db("music-shelf");
  //     var myobj = { name: "1234" };
  //     dbo.collection("folders").insertOne(myobj, function (err, res) {
  //       if (err) throw err;
  //       console.log("1 document inserted");
  //       db.close();
  //     });
  //   });
}

async function getDirInfo() {
  const out = {};
  const dirHandle = await window.showDirectoryPicker();
  await handleDirectoryEntry(dirHandle, out);
  console.log(out);
}

async function handleDirectoryEntry(dirHandle, out) {
  var MongoClient = require("mongodb").MongoClient;

  //   const connection = await mongoose
  //     .connect(DATABASE_URL as string)
  //         .catch((err) => console.log(err));

  MongoClient.connect(DATABASE_URL, async function (err, db) {
    if (err) throw err;
    var dbo = db.db("music-shelf");
    var myobj = { name: "title" };
    // dbo.collection("customers").insertOne(myobj, function (err, res) {
    //   if (err) throw err;
    //   console.log("1 document inserted");

    //   db.close();
    // });

    // for await (const entry of dirHandle.values()) {
    //   if (entry.kind === "file") {
    //     const file = await entry.getFile();
    //     out[file.name] = file;

    //     /* store file with directory */
    //     //console.log(file.name);
    //   }
    //   if (entry.kind === "directory") {
    //     const newHandle = await dirHandle.getDirectoryHandle(entry.name, {
    //       create: false,
    //     });
    //     const newOut = (out[entry.name] = {});
    //     /* store directory */

    //     await handleDirectoryEntry(newHandle, newOut);
    //   }
    // }
  });
}

async function scanMedia() {
  // options
  var openFiles = 0; // counting number of currently opened files
  var directoriesToScan = []; // used to hold the list of directory paths that has yet to be scanned
  var maxOpenFiles = 300; // The max number of files that can be opened at once. Any higher on my machine seemed to make no real speed difference but feel free to experiment
  var waitTime = 20; // defines the sleep time to wait for reading files when 'openFiles' has reached the maximum value
  var startingDirectory = "/"; // root directory to start indexing from - this can be just '/' but always end in a slash

  var fs = require("fs"); // for accessing file system
  var crypto = require("crypto"); // for hashing file contents
  // libaries for access mongodb - copied from mongoDB Node.js drive tutorial
  var Db = require("mongodb").Db,
    // MongoClient = require("mongodb").MongoClient,
    Server = require("mongodb").Server;
  // ReplSetServers = require("mongodb").ReplSetServers,
  //ObjectID = require("mongodb").ObjectID,
  //Binary = require("mongodb").Binary,
  //GridStore = require("mongodb").GridStore,
  //Grid = require("mongodb").Grid,
  //Code = require("mongodb").Code,
  //BSON = require("mongodb").pure().BSON;

  var db = new Db(
    "music-shelf",
    new Server("gjbeech:id84xt90@cluster0.cs5lk.mongodb.net", 27017, {
      auto_reconnect: true,
    }),
    { w: 1 }
  );
  // Connect to the db
  db.open(function (err, db) {
    var scanDirectory = function (dir) {
      if (openFiles > maxOpenFiles) {
        // wait a bit if the maximum number of files is open.
        setTimeout(function () {
          scanDirectory(dir);
        }, waitTime);
      } else {
        // gather files and directories inside directory currently being scanned
        var files = fs.readdirSync(dir);
        files.forEach(function (file) {
          // get stats about file to check if its a directory and to get file size
          var stat = fs.lstatSync(dir + file);
          if (stat.isFile()) {
            if (openFiles > maxOpenFiles) {
              setTimeout(function () {
                readFile(dir, file, stat.size);
              }, waitTime);
            } else {
              readFile(dir, file, stat.size);
            }
          } else if (stat.isDirectory()) {
            // if is a directory add to list of directories to scan.
            directoriesToScan.push(dir + file + "/");
          }
        });
        if (directoriesToScan.length > 0) {
          if (openFiles > maxOpenFiles) {
            setTimeout(function () {
              scanDirectory(directoriesToScan.pop());
            }, waitTime);
          } else {
            scanDirectory(directoriesToScan.pop());
          }
        }
      }
    };

    var readFile = function (dir, file, size) {
      //console.log(openFiles + " readFile");
      if (openFiles > maxOpenFiles) {
        setTimeout(function () {
          readFile(dir, file, size);
        }, waitTime);
      } else {
        openFiles++;
        // setup file stream and hash
        var fd = fs.createReadStream(dir + file);
        var hash = crypto.createHash("md5");
        hash.setEncoding("hex");

        fd.on("end", function () {
          hash.end();
          openFiles--;
          // when finished reading file insert file details into collection (make sure to create the collection first)
          db.collection("files", function (err, collection) {
            collection.insert(
              {
                fileName: file,
                path: dir + file,
                hash: hash.read(),
                size: size,
              },
              function (err, result) {
                if (err) throw err;
                if (openFiles == 0 && directoriesToScan == 0) db.close();
              }
            );
          });
        });

        fd.on("error", function (err) {
          openFiles--;
          console.log("stream error " + err);
        });

        // read all file and pipe it (write it) to the hash object
        fd.pipe(hash);
      }
    };

    // start the scanning
    scanDirectory(startingDirectory);
  });
}
