const express = require('express');
const csv = require('csv-parser');
const { Readable } = require('stream');

const router = express.Router();

// Set up Multer storage
const storage = multer.memoryStorage(); // or use diskStorage if you want to save to a file
const upload = multer({ storage: storage });

router.post('/upload', upload.single('csvFile'), async (req, res) => {
  const results = [];
  const CHUNK_SIZE = 1000; // Adjust batch size based on your server's memory limits
  const bulkOps = [];

  try {
    const readableFileStream = new Readable();
    readableFileStream.push(req.file.buffer); // Push file from memory buffer
    readableFileStream.push(null); // Signal end of stream

    readableFileStream
      .pipe(csv())
      .on('data', (data) => {
        // Push each lead as a MongoDB insert operation
        bulkOps.push({
          insertOne: {
            document: {
              name: data.name,
              contact: data.contact,
              service: data.service,
              location: data.location,
            },
          },
        });

        if (bulkOps.length >= CHUNK_SIZE) {
          results.push(bulkOps);
          bulkOps.length = 0; // Clear batch after processing
        }
      })
      .on('end', async () => {
        // Insert remaining leads in case the file size is smaller than the batch size
        if (bulkOps.length > 0) {
          results.push(bulkOps);
        }
        await processBatches(results);
        res.status(200).json({ message: 'File processed successfully' });
      });
  } catch (error) {
    res.status(500).json({ message: 'Error processing file', error });
  }
});

async function processBatches(bulkOps) {
  for (let ops of bulkOps) {
    await Lead.bulkWrite(ops, { ordered: false }); // Use ordered: false for faster, non-serial execution
  }
}

module.exports = router;
