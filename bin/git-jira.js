const branch = require( 'git-branch' );
const argv = require( 'yargs' ).argv;
const execa = require( 'execa' );

const commitMessage = argv._[ 0 ];

if ( !commitMessage ) {
	return console.log( 'Please provide commit message' );
}

const jiraId = getJiraIdFromCwdRepo();

const p = execa( 'git', [
	'commit',
	'-am',
	jiraId
		? `"JIRA#${ jiraId } ${ commitMessage }"`
	 	: `"${ commitMessage }"`
] );

p.catch( function (e) {} );
p.stdout.pipe( process.stdout );

// -----

function getJiraIdFromCwdRepo() {
	const branchName = branch.sync() || '';
	return getJiraIdFromBranchName( branchName );
}

// KJDS-{number}
function getJiraIdFromBranchName( branchName ) {
	const regexp = /(KJDS-\d+)[^\d]*/i;
	const matched = branchName.match( regexp );

	if ( matched ) {
		return matched[ 1 ];
	}

	return '';
}
