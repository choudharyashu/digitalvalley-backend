const connectDB = require('./db');
const express = require('express');
const Region = require('./models/Region');
const School = require('./models/School');
const Class = require('./models/Class')
const Batch = require('./models/Batch');  
const Topic = require('./models/Topic')
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

connectDB();

// Example: Performing various operations
// const performOperations = async () => {
//   try {
                                    // // Create a new region
                                    // const newRegion = new Region({
                                    //   region_id: 'region_003',
                                    //   region_name: 'Asia'
                                    // });
                                    // await newRegion.save();
                                    // console.log('Region created:', newRegion);

                                    // // Find the newly created region
                                    // const foundRegion = await Region.findOne({ region_id: 'region_003' });
                                    // console.log('Found region:', foundRegion);

                                    // // Update the region name
                                    // await Region.updateOne({ region_id: 'region_003' }, { region_name: 'Asia Updated' });
                                    // console.log('Region updated');

                                    // // Find and display all regions
                                    // const allRegions = await Region.find();
                                    // console.log('All regions:', allRegions);

                                    // // Create a new school in the region
                                    // const newSchool = new School({
                                    // school_id: 'school_002',
                                    // school_name: 'Asia International School',
                                    // region_id: 'region_003'
                                    // });
                                    // await newSchool.save();
                                    // console.log('School created:', newSchool);

                                    // // Delete the school
                                    // await School.deleteOne({ school_id: 'school_002' });
                                    // console.log('School deleted');

                                    // // Delete the region
                                    // await Region.deleteOne({ region_id: 'region_003' });
                                    // console.log('Region deleted');

          //Fetch all regions
          router.get('/regions', async (req, res) => {
            try {
              const regions = await Region.find();
              res.json(regions);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          //Fetch schools based on region
          router.get('/schools', async (req, res) => {
            try {
              const { region_id } = req.query;
              const schools = await School.find({ region_id });
              res.json(schools);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          // Create a new region with validation for duplicates
          router.post('/regions', async (req, res) => {
            try {
              const { region_name } = req.body;
              const region_id = `${region_name.toLowerCase().replace(/\s+/g, '')}_${uuidv4()}`;

              // Check if the region_id already exists
              const existingRegion = await Region.findOne({ region_id });
              if (existingRegion) {
                return res.status(400).json({ error: 'Region ID already exists' });
              }

              const newRegion = new Region({ region_id, region_name });
              await newRegion.save();
              res.json(newRegion);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          // Create a new school with validation for duplicates
          router.post('/schools', async (req, res) => {
            try {
              const { school_name, region_id } = req.body;
              const school_id = `${school_name.split(' ').map(word => word[0]).join('').toUpperCase()}_${uuidv4()}`;

              // Check if the school_id already exists
              const existingSchool = await School.findOne({ school_id });
              if (existingSchool) {
                return res.status(400).json({ error: 'School ID already exists' });
              }

              const newSchool = new School({ school_id, school_name, region_id });
              await newSchool.save();
              res.json(newSchool);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          //Update a region
          router.put('/regions/:id', async (req, res) => {
            try {
              const { id } = req.params;
              const { region_name } = req.body;
              const region_id = region_name.toLowerCase().replace(/\s+/g, '');
              const updatedRegion = await Region.findOneAndUpdate({ region_id: id }, { region_id, region_name }, { new: true });
              res.json(updatedRegion);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          //Update a school
          router.put('/schools/:id', async (req, res) => {
            try {
              const { id } = req.params;
              const { school_name, region_id } = req.body;
              const school_id = school_name.split(' ').map(word => word[0]).join('').toUpperCase();
              const updatedSchool = await School.findOneAndUpdate({ school_id: id }, { school_id, school_name, region_id }, { new: true });
              res.json(updatedSchool);
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          //Delete a region
          router.delete('/regions/:id', async (req, res) => {
            try {
              const { id } = req.params;
              const schoolsInRegion = await School.find({ region_id: id });
              if (schoolsInRegion.length > 0) {
                return res.status(400).json({ error: 'Cannot delete region with existing schools' });
              }
              await Region.findOneAndDelete({ region_id: id });
              res.json({ message: 'Region deleted successfully' });
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          //Delete a school
          router.delete('/schools/:id', async (req, res) => {
            try {
              const { id } = req.params;
              const classesInSchool = await Class.find({ school_id: id });
              if (classesInSchool.length > 0) {
                return res.status(400).json({ error: 'Cannot delete school with existing classes.' });
              }
              await School.findOneAndDelete({ school_id: id });
              res.json({ message: 'School deleted successfully' });
            } catch (err) {
              res.status(500).json({ error: err.message });
            }
          });

          // Create a new class with validation for duplicates
router.post('/classes', async (req, res) => {
  try {
      const { class_name, school_id } = req.body;
      const class_id = `${class_name.replace(/\s+/g, '').toLowerCase()}_${uuidv4()}`;

      // Check if the class_id already exists
      const existingClass = await Class.findOne({ class_id });
      if (existingClass) {
          return res.status(400).json({ error: 'Class ID already exists' });
      }

      const newClass = new Class({ class_id, class_name, school_id });
      await newClass.save();
      res.json(newClass);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Fetch classes by school ID
router.get('/classes', async (req, res) => {
  try {
      const { school_id } = req.query;
      const classes = await Class.find({ school_id });

      // Fetch associated batches for each class
      const classesWithBatches = await Promise.all(
          classes.map(async (classItem) => {
              const batches = await Batch.find({ class_id: classItem.class_id });
              return { ...classItem.toObject(), batches };
          })
      );

      res.status(200).json(classesWithBatches);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Delete a class
router.delete('/classes/:class_id', async (req, res) => {
  try {
    const classId = req.params.class_id;

    // Check if there are any batches associated with the class
    const batches = await Batch.find({ class_id: classId });
    if (batches.length > 0) {
      return res.status(400).json({ message: 'Class cannot be deleted. Batches are present in this class.' });
    }

    const topics = await Topic.find({ class_id: classId });
    if (topics.length > 0) {
      return res.status(400).json({ message: 'Class cannot be deleted. Topics are associated with this class.' });
    }


    // Delete the class using class_id
    const deletedClass = await Class.findOneAndDelete({ class_id: classId });
    if (!deletedClass) {
      return res.status(404).json({ message: 'Class not found.' });
    }

    res.status(200).json({ message: 'Class deleted successfully!' });
  } catch (error) {
    console.error('Error deleting class:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Create a new batch with validation for duplicates
router.post('/batches', async (req, res) => {
  try {
      const { batch_name, class_id } = req.body;
      const batch_id = `${batch_name.replace(/\s+/g, '').toLowerCase()}_${uuidv4()}`;

      // Check if the batch_id already exists
      const existingBatch = await Batch.findOne({ batch_id });
      if (existingBatch) {
          return res.status(400).json({ error: 'Batch ID already exists' });
      }

      const newBatch = new Batch({ batch_id, batch_name, class_id });
      await newBatch.save();
      res.json(newBatch);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Fetch batches by class ID
router.get('/batches', async (req, res) => {
  try {
      const { class_id } = req.query;
      const batches = await Batch.find({ class_id });
      res.status(200).json(batches);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Delete a batch
router.delete('/batches/:id', async (req, res) => {
  try {
      const { id } = req.params;
      await Batch.findOneAndDelete({ batch_id: id });
      res.status(200).json({ message: 'Batch deleted' });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Create a new Topic
router.post('/topics', async (req, res) => {
  const { topic_name, class_id, no_of_sessions } = req.body;
  const topic_id = `${topic_name.replace(/\s+/g, '').toLowerCase()}_${uuidv4()}`;

  try {
      const topic = new Topic({ topic_id, topic_name, class_id, no_of_sessions });
      await topic.save();
      res.status(201).json({ message: 'Topic created successfully', topic });
  } catch (error) {
      res.status(400).json({ error: 'Failed to create topic', details: error.message });
  }
});

// Get all Topics by Class ID
router.get('/topics', async (req, res) => {
  try {
      const { class_id } = req.query;
      const topics = await Topic.find({ class_id });
      res.json(topics);
  } catch (error) {
      res.status(500).json({ error: 'Failed to fetch topics', details: error.message });
  }
});

// Delete a Topic by ID
router.delete('/topics/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const topic = await Topic.findOneAndDelete({ topic_id: id });
      if (!topic) {
          return res.status(404).json({ error: 'Topic not found' });
      }
      res.json({ message: 'Topic deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Failed to delete topic', details: error.message });
  }
});




module.exports = router;


//   } catch (err) {
//     console.error('Error performing operations:', err);
//   } finally {
//     process.exit();
//   }
// };

// performOperations();
