// Quick test to see what Snowflake returns for SHOW VIEWS
import { executeSnowflakeQuery } from './frontend/src/lib/snowflake.js';

async function test() {
	try {
		console.log('Testing SHOW VIEWS IN TEAM_THC2.DATABRIDGE...\n');

		const results = await executeSnowflakeQuery('SHOW VIEWS IN TEAM_THC2.DATABRIDGE');

		console.log('Total results:', results.length);
		console.log('\nFirst result:');
		console.log(JSON.stringify(results[0], null, 2));
		console.log('\nColumn names:');
		console.log(Object.keys(results[0]));

		console.log('\nFirst 5 view names:');
		results.slice(0, 5).forEach((row, i) => {
			console.log(`${i + 1}. Checking all possible name fields:`);
			console.log(`   row.name = ${row.name}`);
			console.log(`   row.NAME = ${row.NAME}`);
			console.log(`   row.table_name = ${row.table_name}`);
			console.log(`   row.TABLE_NAME = ${row.TABLE_NAME}`);
			console.log(`   row.view_name = ${row.view_name}`);
			console.log(`   row.VIEW_NAME = ${row.VIEW_NAME}`);
		});

	} catch (error) {
		console.error('Error:', error);
	}
	process.exit(0);
}

test();
