const fs = require('fs');

// Specify the paths to the input and output JSON files
const inputFilePath = 'username-image3.json';
const outputFilePath = 'abc-organized.json';

// Read the content of the input JSON file
fs.readFile(inputFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const inputArray = JSON.parse(data);

    // Initialize an empty object to store the organized data
    const organizedData = {};

    // Iterate over the input array and organize the data into the object
    inputArray.forEach(item => {
      const { username, image } = item;

      // If the username is not already a key in the object, create an array for it
      if (!organizedData[username]) {
        organizedData[username] = [];
      }

      // Push the image URL to the array for the respective username
      organizedData[username].push(image);
    });

    // Convert the organized data to a JSON string
    const organizedJsonString = JSON.stringify(organizedData, null, 2);

    // Write the JSON string to the output file
    fs.writeFile(outputFilePath, organizedJsonString, 'utf8', (writeErr) => {
      if (writeErr) {
        console.error('Error writing to the file:', writeErr);
      } else {
        console.log(`Organized data saved to ${outputFilePath}`);
      }
    });
  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});
