const express = require('express');
const csv = require('csv-parser');
const multer = require('multer');
const { Readable } = require('stream');
const Lead = require('../models/Lead'); // Adjust the path as necessary

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
        // Prepare a bulk operation for each lead
        bulkOps.push({
          updateOne: {
            filter: { contact: data.contact }, // Use the contact field to check for duplicates
            update: {
              $setOnInsert: { // Only set if the document is being inserted
                name: data.name,
                service: data.service,
                location: data.location,
                status:data.status
              },
            },
            upsert: true, // Insert if it doesn't exist
          },
        });

        // Process in chunks to avoid memory issues
        if (bulkOps.length >= CHUNK_SIZE) {
          results.push(bulkOps);
          bulkOps.length = 0; // Clear batch after processing
        }
      })
      .on('end', async () => {
        // Insert remaining leads if any
        if (bulkOps.length > 0) {
          results.push(bulkOps);
        }

        // Process the batch insertion
        const insertedLeads = [];
        for (const ops of results) {
          const res = await Lead.bulkWrite(ops, { ordered: false });
          insertedLeads.push(...Object.values(res.upsertedIds)); // Collect inserted IDs (if any)
        }

        // Fetch the leads for response (including those that were updated)
        const savedLeads = await Lead.find({ contact: { $in: insertedLeads.map(id => id.contact) } });

        // Send the saved leads as response
        res.status(200).json({ message: 'File processed successfully', data: savedLeads });
      });
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ message: 'Error processing file', error });
  }
});

module.exports = router;
