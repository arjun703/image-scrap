




const { ApifyClient } = require('apify-client');

// Initialize the ApifyClient with API token
const client = new ApifyClient({
    token: 'apify_api_bfTwHZBVtqEy5hs2oRaiZ14VPiTbu40nmkDv',
});



const fs = require('fs');

// Read the content of the JSON file
fs.readFile('insta-usernames.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the file:', err);
    return;
  }

  try {
    // Parse the JSON data
    const usernames = JSON.parse(data);

    // Print the count of usernames
    console.log('Count of Usernames:', usernames.length);

    const originalArray = usernames;


	// Function to divide the array into subgroups of a specified size (e.g., 10)
	function divideArrayIntoGroups(array, groupSize) {
	  const dividedArray = [];
	  for (let i = 0; i < array.length; i += groupSize) {
	    dividedArray.push(array.slice(i, i + groupSize));
	  }
	  return dividedArray;
	}

	// Specify the size of each subgroup
	const subgroupSize = 570;

	// Divide the original array into subgroups
	let subgroups = divideArrayIntoGroups(originalArray, subgroupSize);

	subgroups = subgroups.slice(1,2)

	// Print the subgroups
	subgroups.forEach((subgroup, index) => {
	  
		// Prepare Actor input
		const input = {
		    "username": subgroup,
		    "resultsLimit": 10
		};

		(async () => {
		    // Run the Actor and wait for it to finish
		    const run = await client.actor("apify/instagram-post-scraper").call(input);

		    // Fetch and print Actor results from the run's dataset (if any)
		    console.log('Results from dataset');
		    
		    const { items } = await client.dataset(run.defaultDatasetId).listItems();

			items.forEach(item => {


				const imageData = {};

				if(item.displayUrl){

					imageData['username'] = item.ownerUsername
					
					imageData['image'] = item.displayUrl

					// Example JSON string to append
					const jsonString = JSON.stringify(imageData) + ', ';

					console.log(jsonString)

					// Specify the file path
					const filePath = 'username-image2.json';

					// Append the JSON string to the file
					fs.appendFile(filePath, jsonString + '\n', 'utf8', (err) => {
					  if (err) {
					    console.error('Error appending to the file:', err);
					  } else {
					    console.log('JSON string appended to the file successfully.');
					  }
					});

				}


			})


		    console.log(items[0])

		    // items.forEach((item) => {
		    //     console.dir(item);
		    // });

		})();



	});



  } catch (error) {
    console.error('Error parsing JSON:', error);
  }
});