const Database = require("better-sqlite3");

const db = new Database("../database.db", { verbose: console.log });

const createTableIfNotExist = db.prepare(
  `CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId VARCHAR(30),
      imageKey VARCHAR(30) UNIQUE,
      status VARCHAR(10),
      processedUrl VARCHAR,
      mainUrl VARCHAR,
      size INT
    )`
);

createTableIfNotExist.run();

const insertImage = ({
  userId,
  imageKey,
  status = "queued",
  processedUrl,
  mainUrl,
  size,
}) => {
  const insertStatement = db.prepare(`INSERT INTO images (
        userId,
        imageKey,
        status,
        processedUrl,
        mainUrl,
        size
    ) VALUES (?, ?, ?, ?, ?, ?)`);

  return insertStatement.run(
    userId,
    imageKey,
    status,
    processedUrl,
    mainUrl,
    size
  );
};

const getImagesByUserId = (userId) => {
  const findImageByUserIdStatement = db.prepare(`
        SELECT * FROM images WHERE userId = ?
    `);

  return findImageByUserIdStatement.all(userId);
};

const updateImage = (imageKey, status, processedUrl) => {
  const updateImageStatement = db.prepare(`
      UPDATE images SET status = ?, processedUrl = ? WHERE imageKey = ?
    `);

  return updateImageStatement.run(status, processedUrl, imageKey);
};

module.exports = {
  insertImage,
  getImagesByUserId,
  updateImage,
};
